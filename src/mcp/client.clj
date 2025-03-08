(ns mcp.client
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [docker]
   [flatland.ordered.map :refer [ordered-map]]
   [jsonrpc.logger :as logger]
   [prompts.core :refer [get-prompts-dir]]
   repl))

(def counter (atom 0))

(defn- mcp-stdio-stateless-server
  "create a running container with an attached socket-client 
   and a running Thread that is reading messages from the socket (both stdout and stderr)
     - there is also one go process blocked waiting for the container to exit
  
   returns 
     a map with the container info plus request and notification functions 
     to write jsonrpc messages to the socket,
     and a dead-channel channel that will emit :stopped or :closed when the container stops for any reason 
       the request function will return a promise channel for the matching response
       the notification function is just a side-effect
  "
  [container]
  (docker/check-then-pull container)
  (let [x (docker/create (assoc container
                                :opts {:StdinOnce true
                                       :OpenStdin true
                                       :AttachStdin true}))
        response-promises (atom {})]
    (docker/start x)
    ;; process the output stream channin the background
    ;; should only end once the stream closes
    ;; TODO - docker/stream will block a go channel
    (let [socket-channel (docker/attach-socket (:Id x))
          c (async/chan)
          dead-channel (async/chan)]

      ;; process the output-stream of the container
      (async/thread
        (docker/read-loop socket-channel c))
      (async/go
        (docker/wait x)
        (async/>! c :stopped))
      (async/go-loop [block (async/alt!
                              c ([v _] v)
                              (async/timeout 15000) :timeout)]
        (cond
          ;; read-loop has stopped
          (#{:stopped :timeout} block)
          (do
            (logger/info "socket read loop " block)
            (async/put! dead-channel block)
            block)

          ;; real stdout message
          (and block (:stdout block))
          (let [message (try (json/parse-string (:stdout block) keyword) (catch Throwable _))]
            (if-let [p (get @response-promises (:id message))]
              (async/put! p message)
              (logger/debug "no promise found: " block))
            (recur (async/alt!
                     c ([v _] v)
                     (async/timeout 15000) :timeout)))

          ;; channel is closed
          (nil? block)
          (async/put! dead-channel :closed)

          ;; non-stdout message probably
          :else
          (do
            (logger/debug "socket read loop " (:stderr block))
            (recur (async/alt!
                     c ([v _] v)
                     (async/timeout 15000) :timeout)))))
      ;; add a function to send a jsonrpc request
      (-> x
          (assoc :request
                 (fn [message]
                   (let [id (swap! counter inc)
                         c (async/promise-chan)]
                     (swap! response-promises assoc id c)
                     (try
                       (docker/write-to-stdin socket-channel (str (json/generate-string (assoc message :id id :jsonrpc "2.0")) "\n\n"))
                       (catch Throwable t
                         (println "error closing " t)))
                     c))
                 :notification
                 (fn [message]
                   (try
                     (docker/write-to-stdin socket-channel (str (json/generate-string (assoc message :jsonrpc "2.0")) "\n\n"))
                     (catch Throwable t
                       (println "error closing " t))))
                 :dead-channel dead-channel)))))

(defn with-running-mcp
  "send a message to an mcp server and then shuts it down
    params
      container-definition - for the mcp server
      f - function to generate a jsonrpc request to send post initialize
      f1 - handler for the jsonrpc response (could be just identity)
    returns
      a channel with the response the channel will emit [] if there's an error"
  [container-definition f f1]
  (try
    (let [{:keys [request notification dead-channel] :as container} (mcp-stdio-stateless-server container-definition)]
      (Thread/sleep 2000)
      (async/go
        (try
          (if (= :initialized
                 (async/alt!
                   (request {:method "initialize" :params {:protocolVersion "2024-11-05"
                                                           :capabilities {:tools {}}
                                                           :clientInfo {:name "docker"
                                                                        :version "0.1.0"}}}) :initialized
                   dead-channel ([v _] v)
                   (async/timeout 15000) :timeout))
            (do
              (notification {:method "notifications/initialized" :params {}})
              (let [response (async/alt!
                               (request (f)) ([v _] v)
                               dead-channel ([v _] v)
                               (async/timeout 15000) :timeout)]
                (f1 response)))
            (do
              (logger/error (format
                             "mcp server channel did not initialize for %s"
                             (:image container-definition)))
              []))
          (finally
            (docker/kill-container container)
            (docker/delete container)))))
    (catch Throwable t
      (logger/error "error " t)
      (let [c (async/promise-chan)]
        (async/>!! c [])
        c))))

(defn call-tool
  "
    returns exit-code, done, and a response map with either result or error"
  [container params]
  (with-running-mcp
    (docker/inject-secret-transform container)
    (fn [] {:method "tools/call" :params params})
    identity))

(comment
  (docker/run-container
   {:image "vonwig/stripe:latest"
    :secrets {:stripe.api_key "API_KEY"}
    :entrypoint ["/bin/sh" "-c" "cat /secret/stripe.api_key"]})
  (docker/run-container
   {:image "vonwig/stripe:latest"
    :secrets {:stripe.api_key "API_KEY"}
    :entrypoint ["/bin/sh" "-c" "cat /secret/stripe.api_key"]})
  (async/<!!
   (call-tool
    {:image "vonwig/stripe:latest"
     :entrypoint ["node" "/app/dist/index.js"]
     :secrets {"stripe.api_key" "API_KEY"}
     :command ["--tools=all"
               "--api-key=$API_KEY"]}
    {:name "create_customer"
     :arguments {:name "Jim Clark"}})))

(defn -get-tools [container-definition]
  (async/<!!
   (with-running-mcp
     (docker/inject-secret-transform container-definition)
     (fn [] {:method "tools/list" :params {}})
     (fn [response]
       (->> (-> response :result :tools)
            (map #(assoc % :container (assoc container-definition :type :mcp)))
            (into []))))))

(defn mcp-metadata-cache-file [] (fs/file (get-prompts-dir) "mcp-metadata-cache.edn"))
(def mcp-metadata-cache (atom {}))
(def cache-channel (async/chan))
(defn initialize-cache []
  (swap! mcp-metadata-cache (constantly
                             (try
                               (edn/read-string 
                                 {:readers {'ordered/map (fn [pairs] (into (ordered-map pairs)))}}
                                 (slurp (mcp-metadata-cache-file)))
                               (catch Throwable e
                                 (logger/error "error initializing cache " e) 
                                 {})))))

(async/go-loop []
  (let [[k v] (async/<! cache-channel)
        updated-cache (swap! mcp-metadata-cache assoc k v)]
    (spit
     (mcp-metadata-cache-file)
     (pr-str updated-cache))
    (recur)))

(defn inspect-image [container-definition]
  (:Id
   (docker/image-inspect
    (-> (docker/images {"reference" [(:image container-definition)]})
        first))))

(defn add-digest [container-definition]
  (docker/check-then-pull container-definition)
  (assoc container-definition :digest (inspect-image container-definition)))

(def cached-mcp-get-tools
  (memoize (fn [{:keys [digest] :as container-definition}]
             (if-let [m (get @mcp-metadata-cache digest)]
               m
               (let [m (-get-tools container-definition)]
                 (async/>!! cache-channel [digest m])
                 m)))))

(defn get-tools [container-definition]
  (cached-mcp-get-tools
   (add-digest container-definition)))

(defn get-mcp-tools-from-prompt
  [coll]
  (->> coll
       (mapcat (comp get-tools :container))
       (map (fn [tool]
              {:type "function"
               :function (-> tool
                             (assoc :parameters (:inputSchema tool))
                             (dissoc :inputSchema))}))
       (into [])))

(comment
  (repl/setup-stdout-logger)
  (docker/inject-secret-transform {:image "mcp/stripe:latest"
                                   :secrets {:stripe.api_key "API_KEY"}
                                   :command ["--tools=all"
                                             "--api-key=$API_KEY"]})
  (get-mcp-tools-from-prompt [{:container {:image "vonwig/stripe:latest"
                                           :secrets {:stripe.api_key "API_KEY"}
                                           :command ["--tools=all"
                                                     "--api-key=$API_KEY"]}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/brave-search:latest"
                                           :workdir "/app"
                                           :secrets {:brave.api_key "BRAVE_API_KEY"}}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/slack:latest"
                                           :workdir "/app"
                                           :secrets {:slack.bot_token "SLACK_BOT_TOKEN"
                                                     :slack.team_id "SLACK_TEAM_ID"}}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/redis:latest"
                                           :workdir "/app"}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/fetch:latest"
                                           :workdir "/app"}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/time:latest"
                                           :workdir "/app"}}])
  (docker/run-container (docker/inject-secret-transform {:image "mcp/time:latest"
                                                         :workdir "/app"}))
  (docker/run-container (docker/inject-secret-transform {:image "mcp/stripe:latest"
                                                         :workdir "/app"
                                                         :secrets {:stripe.api_key "API_KEY"}
                                                         :entrypoint ["cat" "/secret/stripe.api_key"]
                                                         :command []})))

(comment
  (def x "HTTP/1.1 101 UPGRADED\nConnection: Upgrade\nContent-Type: application/vnd.docker.multiplexed-stream\nUpgrade: tcp\n\n")
  (count x))


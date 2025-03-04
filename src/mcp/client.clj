(ns mcp.client
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [docker]
   [jsonrpc.logger :as logger]))

(def counter (atom 0))

(defn- mcp-stdio-stateless-server [container]
  (when (not (docker/has-image? (:image container)))
    (docker/-pull container))
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
          (let [message (json/parse-string (:stdout block) keyword)]
            (when-let [p (get @response-promises (:id message))]
              (async/put! p message))
            (recur (async/alt!
                     c ([v _] v)
                     (async/timeout 15000) :timeout)))

          ;; channel is closed
          (nil? block)
          (do
            (logger/info "channel closed")
            (async/put! dead-channel :closed))

          ;; non-stdout message probably
          :else
          (do
            (logger/debug "socket read loop " block)
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
                       (docker/write-to-stdin socket-channel (str (json/generate-string (assoc message :id id :jsonrpc "2.0")) "\n"))
                       (catch Throwable t
                         (println "error closing " t)))
                     c))
                 :dead-channel dead-channel)))))

(defn with-running-mcp
  "send a message to an mcp servers and then shut it down
    params
      container-definition - for the mcp server
      f - function to generate a jsonrpc request to send post initialize
      f1 - handler for the jsonrpc response (could be just identity)
    returns
      a channel with the response the channel will emit [] if there's an error"
  [container-definition f f1]
  (try
    (let [{:keys [request dead-channel] :as container} (mcp-stdio-stateless-server container-definition)]
      (Thread/sleep 2000)
      (async/go
        (try
          (if (= :initialized
                 (async/alt!
                   (request {:method "initialize" :params {}}) :initialized
                   dead-channel ([v _] v)
                   (async/timeout 15000) :timeout))
            (let [response (async/alt!
                             (request (f)) ([v _] v)
                             dead-channel ([v _] v)
                             (async/timeout 15000) :timeout)]
              (logger/debug (format "%s response %s" (:image container-definition) response))
              (f1 response))
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

(defn get-tools [container-definition]
  (with-running-mcp
    (docker/inject-secret-transform container-definition)
    (fn [] {:method "tools/list" :params {}})
    (fn [response]
      (->> (-> response :result :tools)
           (map #(assoc % :container (assoc container-definition :type :mcp)))
           (into [])))))

(defn get-mcp-tools-from-prompt
  [coll]
  (->> coll
       (mapcat (comp async/<!! get-tools :container))
       (map (fn [tool]
              {:type "function"
               :function (-> tool
                             (assoc :parameters (:inputSchema tool))
                             (dissoc :inputSchema))}))
       (into [])))

(comment
  (get-mcp-tools-from-prompt [{:container {:image "mcp/stripe:latest"
                                           :secrets {:stripe.api_key "API_KEY"}
                                           :command ["--tools=all"
                                                     "--api-key=$API_KEY"]}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/brave-search:latest"
                                           :workdir "/app"
                                           :secrets {:brave.api_key "BRAVE_API_KEY"} }}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/slack:latest"
                                           :workdir "/app"
                                           :secrets {:slack.bot_token "SLACK_BOT_TOKEN"
                                                     :slack.team_id "SLACK_TEAM_ID"}}}])
  (get-mcp-tools-from-prompt [{:container {:image "mcp/redis:latest"}}]))

(comment
  (def x "HTTP/1.1 101 UPGRADED\nConnection: Upgrade\nContent-Type: application/vnd.docker.multiplexed-stream\nUpgrade: tcp\n\n")
  (count x))


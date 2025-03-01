(ns mcp.client
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [docker]
   [jsonrpc.logger :as logger]))

(def counter (atom 0))

(defn- mcp-stdio-stateless-server [container]
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
          c (async/chan)]
      ;; process the output-stream of the container
      (async/thread
        (docker/read-loop socket-channel c))
      (async/go-loop [block (async/<! c)]
        (when block
          (when (and block (:stdout block))
            (let [message (json/parse-string (:stdout block) keyword)]
              (when-let [p (get @response-promises (:id message))]
                (async/put! p message))))
          (recur (async/<! c))))
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
                     c)))))))

(defn call-tool
  "
    returns exit-code, done, and a response map with either result or error"
  [container params]
  (try
    (let [{:keys [request] :as container} (mcp-stdio-stateless-server container)]
      (Thread/sleep 2000)
      (async/go
        (async/<! (request {:method "initialize" :params {}}))
        (let [response (async/<! (request {:method "tools/call" :params params}))]
          (docker/kill-container container)
          (docker/delete container)
          response)))
    (catch Throwable t
      (logger/error "error " t))))

(comment
  (async/<!!
    (call-tool {:image "stripe/mcp:latest"
                :command ["--tools=all"
                          "--api-key=sk_blah"]}
               {:name "create_customer"
                :arguments {:name "Jim Clark"}})))

(defn get-tools [container-definition]
  (try
    (let [{:keys [request] :as container} (mcp-stdio-stateless-server container-definition)]
      (Thread/sleep 2000)
      (async/go
        (async/<! (request {:method "initialize" :params {}}))
        (let [response (async/<! (request {:method "tools/list" :params {}}))]
          (docker/kill-container container)
          (docker/delete container)
          (->> (-> response :result :tools)
               (map #(assoc % :container (assoc container-definition :type :mcp)))
               (into [])))))
    (catch Throwable t
      (logger/error "error " t))))

(defn get-mcp-tools-from-prompt
  [coll]
  (->> coll
       (mapcat (comp async/<!! get-tools :container))
       (map #(-> %
                 (assoc :parameters (:inputSchema %))
                 (dissoc :inputSchema)))
       (into [])))

(comment
  (get-mcp-tools-from-prompt [{:container {:image "stripe/mcp:latest"
                                           :command ["--tools=all"
                                                     "--api-key=sk_blah"]}}])
  (->> (-> (async/<!!
            (get-tools {:image "stripe/mcp:latest"
                        :command ["--tools=all"
                                  "--api-key=sk_blah"]})))
       (map :name))
  (->> (-> (async/<!!
            (get-tools {:image "mcp/slack:latest"
                        :workdir "/app"
                        :environment {"SLACK_BOT_TOKEN" "blah"
                                      "SLACK_TEAM_ID" "hey"}})))
       (map :name))
  (->> (-> (async/<!!
            (get-tools {:image "mcp/brave-search:latest"
                        :workdir "/app"
                        :environment {"BRAVE_API_KEY" "blah"}})))
       (map :name)))

(comment
  (def x "HTTP/1.1 101 UPGRADED\nConnection: Upgrade\nContent-Type: application/vnd.docker.multiplexed-stream\nUpgrade: tcp\n\n")
  (count x))


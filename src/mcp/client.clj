(ns mcp.client
  "functions that use mcp definitions in prompts-files to
   to create function definitions"
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [docker]
   [flatland.ordered.map :refer [ordered-map]]
   interpolate
   [jsonrpc.logger :as logger]
   [prompts.core :refer [get-prompts-dir]]
   repl))

(def counter (atom 0))

(def stateful-stdio-servers (atom {}))

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
    ;; process the output stream channin the background
    ;; should only end once the stream closes
    ;; TODO - docker/stream will block a go channel
    (let [socket-channel (docker/attach-socket (:Id x))
          c (async/chan)
          dead-channel (async/chan)]

      (docker/start x)
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
          ;; read-loop has stopped or timed out
          (#{:stopped :timeout} block)
          (do
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

          ;; non-stdout message - show to user
          :else
          (do
            (logger/info "socket read loop " (:stderr block))
            (recur (async/alt!
                     c ([v _] v)
                     (async/timeout 15000) :timeout)))))

      ;; add a function to send a jsonrpc request
      (assoc x
             :request
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
             :dead-channel dead-channel
             :remove (fn []
                       (docker/kill-container x)
                       (docker/delete x))))))

(defn with-running-mcp
  "send a message to an mcp server and then shuts it down
  params
  container-definition - for the mcp server
  f - function to generate a jsonrpc request to send post initialize
  f1 - handler for the jsonrpc response (could be just identity)
  returns
  a channel with the response the channel will emit [] if there's an error"
  [{:keys [server-id stateful] :as container-definition} f]
  (try
    (let [{:keys [request notification dead-channel remove] :as server} (mcp-stdio-stateless-server container-definition)]
      ;; dead-channel will emit either :stopped :timeout or :closed
      (async/go
        (try
          (let [{:keys [initialized response]}
                (async/alt!
                  (request {:method "initialize" :params {:protocolVersion "2024-11-05"
                                                          :capabilities {:tools {}
                                                                         :resources {}}
                                                          :clientInfo {:name "docker"
                                                                       :version "0.1.0"}}}) ([v _] {:initialized true
                                                                                                    :response v})
                  dead-channel ([v _] v)
                  (async/timeout 15000) :timeout)]
            (if (true? initialized)
              (do
                (notification {:method "notifications/initialized" :params {}})
                (async/<! (f server response)))
              (do
                (logger/error (format
                               "mcp server channel did not initialize for %s"
                               (:image container-definition)))
                {:error :did-not-initialize})))
          (finally
            (when (not (true? stateful))
              (remove))))))
    (catch Throwable t
      (logger/error "error " t)
      (let [c (async/promise-chan)]
        (async/>!! c {:error :exception :ex t})
        c))))

(defn- send-call-tool-message [params {:keys [request dead-channel]} _]
  (async/go
    (let [response (async/alt!
                     (request {:method "tools/call" :params params}) ([v _] v)
                     dead-channel ([v _] v)
                     (async/timeout 15000) :timeout)]
      response)))

(defn- send-list-tools-message [container-definition {:keys [request dead-channel]} _]
  (async/go
    (let [response (async/alt!
                     (request {:method "tools/list" :params {}}) ([v _] v)
                     dead-channel ([v _] v)
                     (async/timeout 15000) :timeout)]
      (->> (-> response :result :tools)
           ;; add container definition to every tool
           (map #(assoc % :container (assoc container-definition :type :mcp)))
           (into [])))))

(defn- send-get-resource-message [params {:keys [request dead-channel]} _]
  (async/go
    (let [response (async/alt!
                     (request {:method "resources/read" :params params}) ([v _] v)
                     dead-channel ([v _] v)
                     (async/timeout 15000) :timeout)]
      (logger/info "resource: " (-> response :result :contents))
      response)))

(defn- send-list-resources-message [params {:keys [request dead-channel]} _]
  (async/go
    (let [response (async/alt!
                     (request {:method "resources/list" :params params}) ([v _] v)
                     dead-channel ([v _] v)
                     (async/timeout 15000) :timeout)]
      response)))

(defn- send-list-resource-templates-message [params {:keys [request dead-channel]} _]
  (async/go
    (let [response (async/alt!
                     (request {:method "resources/templates/list" :params params}) ([v _] v)
                     dead-channel ([v _] v)
                     (async/timeout 15000) :timeout)]
      response)))

(defn call-tool
  "call tool in server container - might call running server if server is stateful
    returns exit-code, done, and a response map with either result or error"
  [container params]
  (with-running-mcp
    (docker/inject-secret-transform container)
    (partial send-call-tool-message params)))

(defn -get-resources
  "list resources"
  [container-definition params]
  (async/<!!
   (with-running-mcp
     (-> container-definition
         ;; interpolate parameters 
         ;;   - this looks like an extra step because it's not running from the tools module
         ((fn [c] (interpolate/container-definition
                   {:container (dissoc c :parameter-values)}
                   {}
                   (json/generate-string
                    (:parameter-values c)))))
         ;; inject secrets from container definition
         docker/inject-secret-transform)
     (partial send-list-resources-message params))))

(defn -get-resource
  "list resources"
  [container-definition params]
  (async/<!!
   (with-running-mcp
     (-> container-definition
         ;; interpolate parameters 
         ;;   - this looks like an extra step because it's not running from the tools module
         ((fn [c] (interpolate/container-definition
                   {:container (dissoc c :parameter-values)}
                   {}
                   (json/generate-string
                    (:parameter-values c)))))
         ;; inject secrets from container definition
         docker/inject-secret-transform)
     (partial send-get-resource-message params))))

(defn -get-resource-templates
  "list resources"
  [container-definition params]
  (async/<!!
   (with-running-mcp
     (-> container-definition
         ;; interpolate parameters 
         ;;   - this looks like an extra step because it's not running from the tools module
         ((fn [c] (interpolate/container-definition
                   {:container (dissoc c :parameter-values)}
                   {}
                   (json/generate-string
                    (:parameter-values c)))))
         ;; inject secrets from container definition
         docker/inject-secret-transform)
     (partial send-list-resource-templates-message params))))

(defn -get-tools
  "get tool definitions from container - this container can always be shutdown"
  [container-definition]
  (async/<!!
   (with-running-mcp
     (-> container-definition
         ;; interpolate parameters 
         ;;   - this looks like an extra step because it's not running from the tools module
         ((fn [c] (interpolate/container-definition
                   {:container (dissoc c :parameter-values)}
                   {}
                   (json/generate-string
                    (:parameter-values c)))))
         ;; inject secrets from container definition
         docker/inject-secret-transform)
     (partial send-list-tools-message container-definition))))

;; maintain a mcp-meadata-cache-file
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
;; ------------------------------

(defn inspect-image [container-definition]
  (:Id
   (docker/image-inspect
    (-> (docker/images {"reference" [(:image container-definition)]})
        first))))

(defn add-digest [container-definition]
  (docker/check-then-pull container-definition)
  (assoc container-definition :digest (inspect-image container-definition)))

(def cached-mcp-get-tools
  (fn [container-definition]
    (if-let [m (get @mcp-metadata-cache container-definition)]
      m
      (let [m (-get-tools container-definition)]
        (if (and
             (not (and (map? m) (contains? m :error)))
             (seq m))
          (async/>!! cache-channel [container-definition m])
          (logger/warn "failed to get tools for " (:image container-definition)))
        m))))

(defn get-tools [container-definition]
  (cached-mcp-get-tools
   (add-digest container-definition)))

(defn get-mcp-tools-from-prompt
  "ask MCP server container for the list of tools
     always shutdown these servers even if they're stateful. They only 
     accumulate state if they've received tool calls."
  [{:keys [mcp parameter-values local-get-tools] :or {local-get-tools get-tools}}]
  (->> mcp
       (map (fn [mcp-definition]
              (assoc-in mcp-definition [:container :parameter-values] parameter-values)))
       (mapcat (comp local-get-tools :container))
       (map (fn [tool]
              {:type "function"
               :function (-> tool
                             (assoc :parameters (:inputSchema tool))
                             (dissoc :inputSchema))}))
       (into [])))

(def cursors (atom {}))

(defn resource-cursor
  "list resources across all mcp servers
    return channel to output resources from MCP servers"
  [cursor resource-factory]
  (if-let [c (get @cursors cursor)]
    c
    (let [c (async/chan 1)]
      (async/go
        (let [container-processors
              (->> resource-factory
                   (filter :list)
                   (map (fn [{:keys [list]}] (list c cursor 100)))
                   (async/merge)
                   (async/into []))]
          ;; TODO timeout
          (async/<! container-processors)
          (swap! cursors dissoc cursor)
          (async/close! c)))
      c)))

;; prototypical list function
(defn list-function-factory
  "construct a function that lists resources for one container MCP
    the output function takes an output channel as a parameter and return a status channel
    the status channel will emit :done when the MCP is finished emitting resources"
  [container-definition]
  (fn list-function [c cursor size]
    ;; TODO cache the container?
    (async/go-loop []
      ;; TODO - add cursor and size to the request
      (let [response (-get-resources container-definition {})
            coll (-> response :result :resources)]
        (when (seq coll)
          (async/<! (async/onto-chan! c (into [] coll) false)))
        (if (:nextCursor response)
          (do
            (logger/info (format "loop again for cursor %s" (:nextCursor response)))
            (recur))
          :done)))))

(defn resource-templates-cursor
  "  return channel to output resource templates from MCP severs"
  [cursor resource-factory]
  (if-let [c (get @cursors cursor)]
    c
    (let [c (async/chan 1)]
      (async/go
        (let [container-processors
              (->> resource-factory
                   (filter :list-resource-templates)
                   (map (fn [{:keys [list-resource-templates]}] 
                          (list-resource-templates c cursor 100)))
                   (async/merge)
                   (async/into []))]
          ;; TODO timeout
          (async/<! container-processors)
          (swap! cursors dissoc cursor)
          (async/close! c)))
      c)))

(defn resource-templates-function-factory 
  "construct a function that gets resource templates from a container MCP
     return a channel to emit resource templates."
  [container-definition]
  (fn list-resource-templates [c cursor size]
    ;; TODO cache the container?
    (async/go-loop []
      ;; TODO - add cursor and size to the request
      (let [response (-get-resource-templates container-definition {})
            coll (-> response :result :resourceTemplates)]
        (when (seq coll)
          (async/<! (async/onto-chan! c (into [] coll) false)))
        (if (:nextCursor response)
          (do
            (logger/info (format "loop again for cursor %s" (:nextCursor response)))
            (recur))
          :done)))))

(defn get-resource
  "Search all mcp servers for a uri
     params
       uri - uri to search for
       resource-factory - coll of mcp servers that can provide resources
     return a channel with an array of matching resource results"
  [uri resource-factory]
  (->>
   resource-factory
   (filter :get)
   (map (fn [{:keys [get]}] (get uri)))
   (async/merge)
   (async/into [])))

(defn get-function-factory
  "construct a function that gets a resource from a container MCP
     return a channel to emit matching resources. The channel might just close if nothing is found."
  [container-definition]
  (fn get [uri]
    (let [c (async/chan)]
      ; TODO skip this if this container-definition doesn't support this uri
      (let [response (-get-resource container-definition {:uri uri})]
        (when (:error response)
          (logger/error (format "%s error getting resource %s" container-definition response)))
        (when (:result response)
          (logger/info (format "%s got resource %s" (:image container-definition) (:result response)))
          (async/put! c (:result response))))
      (async/close! c)
      c)))


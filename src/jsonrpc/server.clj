(ns jsonrpc.server
  (:refer-clojure :exclude [run!])
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core :as c]
   [clojure.core.async :as async]
   [clojure.pprint :as pprint]
   [clojure.string :as string]
   docker
   git
   graph
   jsonrpc
   [jsonrpc.db :as db]
   [jsonrpc.extras]
   [jsonrpc.logger :as logger]
   [jsonrpc.producer :as producer]
   [jsonrpc.socket-server :as socket-server]
   [lsp4clj.coercer :as coercer]
   [lsp4clj.io-chan :as io-chan]
   [lsp4clj.io-server :refer [stdio-server]]
   [lsp4clj.server :as lsp.server]
   [mcp.client :as client]
   [medley.core :as medley]
   [promesa.core :as p]
   [prompts.core :refer [get-prompts-dir registry]]
   shutdown
   state
   tools
   user-loop
   volumes)
  (:gen-class))

(set! *warn-on-reflection* true)

(defmacro conform-or-log
  "Provides log function for conformation, while preserving line numbers."
  [spec value]
  (let [fmeta (assoc (meta &form)
                     :file *file*
                     :ns-str (str *ns*))]
    `(coercer/conform-or-log
      (fn [& args#]
        (log! :error args# ~fmeta))
      ~spec
      ~value)))

(defmacro eventually [& body]
  `(p/thread ~@body))

(defn log-wrapper-fn
  [level & args]
  ;; NOTE: this does not do compile-time elision because the level isn't a constant.
  ;; We don't really care because we always log all levels.
  (logger/info (str level (apply str args)))
  #_(timbre/log! level :p args))

(defn ^:private exit-server [server]
  (logger/info "Exiting...")
  (lsp.server/shutdown server) ;; blocks, waiting up to 10s for previously received messages to be processed
  (shutdown-agents)
  (System/exit 0))

(defmethod lsp.server/receive-notification "exit" [_ {:keys [server]} _params]
  (exit-server server))

(defmethod lsp.server/receive-request "ping" [_ _ _]
  (logger/info "ping")
  {})

(defmethod lsp.server/receive-request "initialize" [_ {:keys [db* server-id]} params]
  (logger/info (format "Initializing server id %d %s" server-id params))

  ;; merges client-info capabilities and client protocol-version
  (swap! db* assoc-in [:servers server-id] params)
  {:protocol-version "2024-11-05"
   :capabilities {:prompts {:listChanged true}
                  :tools {:listChanged true}
                  :resources {}}
   :server-info {:name "docker-mcp-server"
                 :version "0.0.1"}})

(defmethod lsp.server/receive-notification "notifications/initialized" [_ {:keys [db* server server-id]} _]
  (logger/info "Initialized! " (-> @db* :servers (get server-id)))
  (lsp.server/discarding-stdout
   (when (get-in @db* [:servers server-id :capabilities :roots])
     (let [response (lsp.server/deref-or-cancel
                     (lsp.server/send-request server "roots/list" {})
                     10e3 ::timeout)]
       (cond
           ;;
         (= ::timeout response)
         (logger/error "No response from client for workspace/inlayHint/refresh")
           ;;
         (:roots response)
         (do
           (logger/info "client sent roots " (:roots response))
           (swap! db* update-in [:servers server-id] (fnil merge {}) response))
           ;;
         :else
         (logger/warn "unexpected response " response))))))

; level is debug info notice warning error critical alert emergency
(defmethod lsp.server/receive-request "logging/setLevel" [_ {:keys [db*]} {:keys [level]}]
  (swap! db* assoc :mcp.log/level level)
  {})

;; server features
(defmethod lsp.server/receive-request "completion/complete" [_ _ _]
  {:completion {:values []
                :total 0
                :hasMore false}})

(defn entry->prompt-listing [_ v message]
  (let [{:keys [arguments]} (:metadata v)]
    (merge
     (select-keys message [:name :description])
     (when arguments
       {:arguments arguments}))))

;; -----------------
;; MCP prompts
;; -----------------

(defmethod lsp.server/receive-request "prompts/list" [_ {:keys [db*]} params]
  ;; TODO might contain a cursor
  (logger/info "prompts/list" params)
  (let [prompts
        {:prompts (->> (:mcp.prompts/registry @db*)
                       (mapcat
                        (fn [[k v]] (map (partial entry->prompt-listing k v) (:messages v))))
                       (into []))}]
    prompts))

(defmethod lsp.server/receive-request "prompts/get" [_ {:keys [db*]} {:keys [name arguments]}]
  (logger/info "prompts/get " name)
  (let [{:keys [prompt-function description]}
        (get
         (->> @db*
              :mcp.prompts/registry
              vals
              (mapcat :mcp/prompt-registry)
              (into {}))
         name)]
    {:description description
     :messages (prompt-function (or arguments {}))}))

;; -----------------
;; MCP resources
;; -----------------

(defmethod lsp.server/receive-request "resources/list" [_ {:keys [db*]} _]
  (logger/info "resources/list")
  (let [resources
        {:resources (or (->> (:mcp.prompts/resources @db*)
                             (vals)
                             (map #(select-keys % [:uri :name :description :mimeType])))
                        [])}]
    resources))

(defmethod lsp.server/receive-request "resources/read" [_ {:keys [db*]} params]
  (logger/info "resouces/read" params)
  {:contents (concat
              []
              (when-let [m (get-in @db* [:mcp.prompts/resources (:uri params)])]
                [(select-keys m [:uri :mimeType :text :blob])]))})

(defmethod lsp.server/receive-request "resources/templates/list" [_ _ _]
  (logger/info "resources/templates/list")
  {:resource-templates
   ;; uriTemplate, name, description, mimeType
   ;; uriTemplates have parameters like {path}
   ;;   example: "file:///{path}
   []})

(defmethod lsp.server/receive-request "resources/subscribe" [_ _ params]
  (logger/info "resources/subscribe" params)
  {:resource-templates []})

;; -----------------
;; MCP Tools
;; -----------------

(defmethod lsp.server/receive-request "tools/list" [_ {:keys [db*]} _]
  ;; TODO cursors
  {:tools (->> (:mcp.prompts/registry @db*)
               (vals)
               (mapcat :functions)
               (map (fn [m] (-> (:function m)
                                (select-keys [:name :description])
                                (assoc :inputSchema (or (-> m :function :parameters) {:type "object" :properties {}})))))
               (into []))})

(defn resource-uri [db-resources uri]
  ((->> db-resources
        vals
        (map (fn [{:keys [uri matches]}] [matches uri]))
        (into {})) uri))

(defn update-matched-resources
  "check if any collected-resources match the db ones and update them"
  [db-resources collected-resources]
  (let [matched (->> collected-resources
                     (filter (comp (into #{} (->> db-resources (vals) (map :matches))) :uri :resource)))]
    (medley/deep-merge
     db-resources
     (->> matched
          (map (fn [{{:keys [uri text]} :resource}] [(resource-uri db-resources uri) {:text text}]))
          (into {})))))

(defn update-resources
  "update the resource list in the db
     params - resources coll of mcp resources extracted from last tool call"
  [{:keys [db* producer]} resources]
  (when (seq resources)
    (swap! db* update :mcp.prompts/resources update-matched-resources resources)
    (producer/publish-resource-list-changed producer {})))

(defn create-tool-outputs [tool-outputs]
  (if (some :content tool-outputs)
    ;; messages
    [{:type "text"
      :text (->>
             tool-outputs
             (map :content)
             (apply str))}]
    ;; tool call responses
    (->> tool-outputs
         (mapcat (comp :content :result))
         (into []))))

(defn mcp-tool-calls
  " params
  db* - uses mcp.prompts/registry and host-dir
  params - tools/call mcp params"
  [{:keys [db* server-id] :as components} params]
  (volumes/with-volume
    (fn [thread-id]
      ;; TODO non-mcp tool calls are maps of content, role tool_call_id
      ;;      we turn them into one text message and respond to the jsonrpc request here
      ;;      for mcp tool calls the response will already be valid content
      ;;        so we can concat it and just return the result (or error)
      ;; tool-outputs are :content, :role, :tool_call_id 
      ;;   (MCP doesn't care about :role or :tool_call_id - these are client concerns)
      (let [tool-outputs (->>
                          (tools/make-tool-calls
                           0
                           (partial
                            tools/function-handler
                            {:functions (->> @db* :mcp.prompts/registry vals (mapcat :functions))
                             :host-dir (-> @db* :host-dir)
                             :thread-id thread-id})
                           ;; tool calls are functions, which are arguments,name maps, and ids
                           ;; mcp tool call params are also maps of name, and arguments
                           [{:function (update
                                        params :arguments
                                        (fn [arguments]
                                          (logger/trace
                                           (-> arguments
                                               (merge 
                                                 (db/parameter-values (:name params))
                                                 (select-keys (-> @db* :servers (get server-id)) [:roots]))
                                               (json/generate-string)))))
                             :id "1"}])
                          (async/reduce conj [])
                          (async/<!!))]
     ;; TODO with mcp, tool-calls with errors are still jsonrpc results
     ;;      protocol errors are jsonrpc errors, with a code and a message
     ;; TODO if result is ::method-not-found, we'll get a protocol error
     ;;      responding with a map containing an :error key will also generate a protocol error
        {:content
         (concat
          (create-tool-outputs tool-outputs)
          (volumes/pick-up-mcp-resources thread-id (partial update-resources components)))
         :is-error false}))))

(defmethod lsp.server/receive-request "tools/call" [_ components params]
  (logger/info "tools/call")
  (logger/info "with params" params)
  (lsp.server/discarding-stdout
   (let [response (mcp-tool-calls components params)]
     (logger/info "content " (with-out-str (pprint/pprint response)))
     response)))

(defn ^:private monitor-server-logs [log-ch]
  ;; NOTE: if this were moved to `initialize`, after timbre has been configured,
  ;; the server's startup logs and traces would appear in the regular log file
  ;; instead of the temp log file. We don't do this though because if anything
  ;; bad happened before `initialize`, we wouldn't get any logs.
  (async/go-loop []
    (when-let [log-args (async/<! log-ch)]
      (apply log-wrapper-fn log-args)
      (recur))))

(def producers (atom []))

(defn- init-dynamic-prompt-watcher [opts]
  (async/thread
    (let [{x :container}
          (docker/run-streaming-function-with-no-stdin
           {:image "vonwig/inotifywait:latest"
            :volumes ["docker-prompts:/prompts"]
            :command ["-e" "create" "-e" "modify" "-e" "delete" "-q" "-m" "/prompts"]}
           (fn [line]
             (logger/info "change event" line)
             (let [[_dir _event f] (string/split line #"\s+")]
               (when (= f "registry.yaml")
                 (try
                   (db/add-refs (db/registry-refs registry))
                   (doseq [producer @producers]
                     (try
                       (producer/publish-tool-list-changed producer {})
                       (producer/publish-prompt-list-changed producer {})
                       (catch Throwable _)))
                   (catch Throwable t
                     (logger/error t "unable to parse registry.yaml"))))
               (when (string/ends-with? f ".md")
                 (try
                   (db/update-prompt opts (string/replace f #"\.md" "") (slurp (str "/prompts/" f)))
                   (doseq [producer @producers]
                     (try
                       (producer/publish-tool-list-changed producer {})
                       (producer/publish-prompt-list-changed producer {})
                       (catch Throwable _)))
                   (catch Throwable t
                     (logger/error t "unable to parse " f)))))))]
      (shutdown/schedule-container-shutdown
       (fn []
         (logger/info "inotifywait shutting down")
         (docker/kill-container x)
         (docker/delete x))))))

(defn initialize-prompts [opts]
  ;; initialize mcp cache
  (client/initialize-cache)
  ;; register private non-catalog prompts
  (doseq [[s content] (->> (fs/list-dir (get-prompts-dir))
                           (filter (fn [f] (= "md" (fs/extension f))))
                           (map (fn [f] [(string/replace (fs/file-name (fs/file f)) #"\.md" "") (slurp (fs/file f))])))]
    (db/update-prompt opts s content))
  ;; add dynamic refs from prompts volume
  (db/add-refs
   (concat (->> (:register opts)
                (map (fn [ref] {:type :static :ref ref})))
         ;; register dynamic prompts
           (when (fs/exists? (fs/file registry))
             (db/registry-refs registry)))))

(def server-counter (atom 0))

(defn server-context
  "create chan server options for any io chan server that we build"
  [{:keys [trace-level] :or {trace-level "off"} :as opts}]
  (lsp.server/discarding-stdout
   (let [timbre-logger (logger/->TimbreLogger)
         log-path (logger/setup timbre-logger)
         db* db/db*
         log-ch (async/chan (async/sliding-buffer 20))]
     ;; add option map and log-path to the db
     (swap! db* merge {:log-path log-path} (dissoc opts :in))
     ;; initialize shutdown hook
     (async/thread
       (shutdown/init))
     ;; initialize prompts
     (initialize-prompts opts)
     ;; watch dynamic prompts in background
     (init-dynamic-prompt-watcher opts)
     ;; monitor our log channel (used by all chan servers)
     (monitor-server-logs log-ch)
     ;; common server opts
     (merge
      {;:keyword-function identity
       :log-ch log-ch
       :trace-ch log-ch
       :trace-level trace-level
       :keyword-function keyword
       :server-context-factory
       (fn [server]
         (let [producer (producer/->McpProducer server db*)]
           (swap! producers conj producer)
           {:db* db*
            :logger timbre-logger
            :producer producer
            :server-id (swap! server-counter inc)
            :server server}))}
      (when (:mcp opts)
        {:in-chan-factory io-chan/mcp-input-stream->input-chan
         :out-chan-factory io-chan/mcp-output-stream->output-chan})))))

(defn run-socket-server! [opts server-opts]
  (logger/info "Starting socket server on" (:port opts))
  (socket-server/server (merge opts server-opts)))

(defn run-server! [opts server-opts]
  (lsp.server/discarding-stdout
   (let [server (stdio-server
                 (merge
                  server-opts
                  {:in (or (:in opts) System/in)
                   :out System/out}))]
     (logger/info "Starting server...")
     ;; only on lsp.server/start will the stdio channels start being used
     (let [{:keys [producer] :as context} ((:server-context-factory server-opts) server)]
       [producer (lsp.server/start server context)]))))


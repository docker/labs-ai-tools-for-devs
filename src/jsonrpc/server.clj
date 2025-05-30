(ns jsonrpc.server
  (:refer-clojure :exclude [run!])
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core :as c]
   [clojure.core.async :as async]
   [clojure.pprint :as pprint]
   [clojure.string :as string]
   [docker]
   [git]
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.producer :as producer]
   [jsonrpc.prompt-change-events]
   [jsonrpc.socket-server :as socket-server]
   [jsonrpc.state]
   [lsp4clj.coercer :as coercer]
   [lsp4clj.io-chan :as io-chan]
   [lsp4clj.io-server :refer [stdio-server]]
   [lsp4clj.server :as lsp.server]
   [mcp.client :as client]
   [medley.core :as medley]
   [nrepl]
   [promesa.core :as p]
   [prompts.core :refer [get-prompts-dir registry]]
   [shutdown]
   [state]
   [tools]
   [volumes])
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
  {})

(defmethod lsp.server/receive-request "initialize" [_ {:keys [db* server-id]} params]
  (logger/info (format "Initializing server id %s %s" server-id params))

  ;; merges client-info capabilities and client protocol-version
  (swap! db* assoc-in [:servers server-id] params)
  {:protocolVersion "2024-11-05"
   :capabilities {:prompts {:listChanged true}
                  :tools {:listChanged true}
                  :resources {:listChanged true}}
   :serverInfo {:name "docker-mcp-server"
                 :version "0.1.0"}})

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

(defmethod lsp.server/receive-request "resources/list" [_ {:keys [db*]} {:keys [cursor] :as params}]
  (logger/info "resources/list " params)
  ;; add nextCursor to result if there are more resources
  (let [nextCursor (or cursor (str (java.util.UUID/randomUUID)))
        resource-factory (->> (:mcp.prompts/registry @db*)
                              (vals)
                              (map :mcp/resources)
                              (filter seq)
                              (into []))
        mcp-resources (->> (mcp.client/resource-cursor nextCursor resource-factory)
                           (async/take 100)
                           (async/into [])
                           (async/<!!))
        resources
        (merge
         {:resources (concat
                      (->> (:mcp.prompts/resources @db*)
                           (vals)
                           (map #(select-keys % [:uri :name :description :mimeType])))
                      mcp-resources)}
         (when (= 100 (count mcp-resources))
           {:nextCursor nextCursor}))]
    resources))

(defmethod lsp.server/receive-request "resources/read" [_ {:keys [db*]} params]
  (logger/info "resouces/read" params)
  {:contents (concat
              []
              (when-let [m (get-in @db* [:mcp.prompts/resources (:uri params)])]
                [(select-keys m [:uri :mimeType :text :blob])])
              (let [results-collection (async/<!! (mcp.client/get-resource
                                                   (:uri params)
                                                   (->> (:mcp.prompts/registry @db*)
                                                        (vals)
                                                        (map :mcp/resources)
                                                        (filter seq)
                                                        (into []))))]
                (->> results-collection
                     (mapcat :contents))))})

(defmethod lsp.server/receive-request "resources/templates/list" [_ {:keys [db*]} {:keys [cursor] :as params}]
  (logger/info "resources/templates/list" params)
  (let [nextCursor (or cursor (str (java.util.UUID/randomUUID)))
        resource-factory (->> (:mcp.prompts/registry @db*)
                              (vals)
                              (map :mcp/resources)
                              (filter seq)
                              (into []))
        resource-templates (->> (mcp.client/resource-templates-cursor nextCursor resource-factory)
                                (async/take 100)
                                (async/into [])
                                (async/<!!))]
    (merge
     {:resourceTemplates resource-templates}
     (when (= 100 (count resource-templates))
       {:nextCursor nextCursor}))))

(defmethod lsp.server/receive-request "resources/subscribe" [_ _ params]
  (logger/info "resources/subscribe" params)
  {:resourceTemplates []})

;; -----------------
;; MCP Tools
;; -----------------

(defmethod lsp.server/receive-request "tools/list" [_ {:keys [db* server-id]} _]
  (let [tool-filter (-> @db* :tool/filters (get server-id))]
    (logger/info "tools/list for filter " tool-filter)
    ;; TODO cursors
    {:tools (->> (:mcp.prompts/registry @db*)
                 (vals)
                 (mapcat :functions)
                 (map (fn [m] (-> (:function m)
                                  (select-keys [:name :description])
                                  (assoc :inputSchema (or (-> m :function :parameters) {:type "object" :properties {}})))))
                 (filter (comp (or tool-filter (constantly true)) :name))
                 (into []))}))

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

(defn get-functions [db*]
  (->> @db* :mcp.prompts/registry vals (mapcat :functions)))

(defn poci? [{:keys [db*] :as components} params]
  (not
   (= :mcp
      (-> (filter #(= (-> params :name) (-> % :function :name)) (get-functions db*))
          first
          :function
          :container
          :type))))

(defn make-tool-calls [{:keys [db* server-id] :as components} params {:keys [thread-id] :as opts}]
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
                        (merge
                         {:functions (get-functions db*)
                          :host-dir (-> @db* :host-dir)
                          :server-id server-id}
                         (when thread-id {:thread-id thread-id})))
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
                         ;; TODO there's no id here like in regular agent tool calling loops
                         ;; MCP clients do this on their side (using just the response id)
                         :id "1"}])
                      (async/reduce conj [])
                      (async/<!!))]
    ;; TODO with mcp, tool-calls with errors are still jsonrpc results
    ;;      protocol errors are jsonrpc errors, with a code and a message
    ;; TODO if result is ::method-not-found, we'll get a protocol error
    ;;      responding with a map containing an :error key will also generate a protocol error
    {:content (create-tool-outputs tool-outputs)
     :is-error false}))

(defn mcp-tool-calls
  " params
  db* - uses mcp.prompts/registry and host-dir
  params - tools/call mcp params"
  [{:keys [db* server-id] :as components} params]
  (if (poci? components params)
    (do
      (logger/info "poci tool call, not using mcp")
      (volumes/with-volume
        (fn [thread-id]
          (let [response (make-tool-calls components params {:thread-id thread-id})]
            (update response :content concat (volumes/pick-up-mcp-resources thread-id (partial update-resources components)))))))
    (make-tool-calls components params {})))

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

(defn ^:private monitor-audit-logs [audit-ch]
  (async/go-loop []
    (when-let [log-args (async/<! audit-ch)]
      (apply log-wrapper-fn log-args)
      (recur))))

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
           (when (fs/exists? (registry))
             (db/registry-refs (registry))))))

(defn server-context
  "create chan server options for any io chan server that we build"
  [{:keys [trace-level] :or {trace-level "off"} :as opts}]
  (lsp.server/discarding-stdout
   (let [timbre-logger (logger/->TimbreLogger)
         log-path (logger/setup timbre-logger)
         db* db/db*
         log-ch (async/chan (async/sliding-buffer 20))
         audit-ch (async/chan)]
     ;; add option map and log-path to the db
     (swap! db* merge {:log-path log-path} (dissoc opts :in))
     ;; initialize shutdown hook
     (async/thread
       (shutdown/init))
     ;; initialize prompts
     (initialize-prompts opts)
     ;; watch dynamic prompts in background
     (jsonrpc.prompt-change-events/init-dynamic-prompt-watcher
      opts
      jsonrpc.prompt-change-events/registry-updated
      jsonrpc.prompt-change-events/markdown-tool-updated)
     ;; monitor our log channel (used by all chan servers)
     (monitor-server-logs log-ch)
     (monitor-audit-logs audit-ch)
     ;; this won't do anything if nrepl is not present
     (nrepl/setup-nrepl)
     ;; common server opts
     (merge
      {;:keyword-function identity
       :log-ch log-ch
       :audit-ch audit-ch
       :trace-ch log-ch
       :trace-level trace-level
       :keyword-function keyword
       :server-context-factory
       (fn [server server-id]
         (let [producer (producer/->McpProducer server db*)]
           (swap! jsonrpc.state/producers assoc server-id producer)
           {:db* db*
            :logger timbre-logger
            :producer producer
            :server-id server-id
            :server server}))}
      (when (:mcp opts)
        {:in-chan-factory io-chan/mcp-input-stream->input-chan
         :out-chan-factory io-chan/mcp-output-stream->output-chan})))))

(defn run-socket-server! [opts server-opts]
  (logger/info (format "Starting socket server (docker version %s) on port %s" (:appVersion (docker/get-versions {})) (:port opts)))
  (socket-server/server (merge opts server-opts)))

(defn run-server! [opts server-opts]
  (lsp.server/discarding-stdout
   (let [server (stdio-server
                 (merge
                  server-opts
                  {:in (or (:in opts) System/in)
                   :out System/out}))]
     (logger/info (format "Starting server (docker version %s)..." (:appVersion (docker/get-versions {}))))
     ;; only on lsp.server/start will the stdio channels start being used
     (let [server-id (swap! jsonrpc.state/server-counter inc)
           {:keys [producer] :as context}
           ((:server-context-factory server-opts) server server-id)]
       [producer (lsp.server/start server context)]))))


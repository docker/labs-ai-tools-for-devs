(ns jsonrpc.server
  (:refer-clojure :exclude [run!])
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clj-yaml.core :as yaml]
   [clojure.core :as c]
   [clojure.core.async :as async]
   [clojure.pprint :as pprint]
   [clojure.string :as string]
   docker
   git
   graph
   jsonrpc
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.producer :as producer]
   [lsp4clj.coercer :as coercer]
   [lsp4clj.io-chan :as io-chan]
   [lsp4clj.io-server :refer [stdio-server]]
   [lsp4clj.server :as lsp.server]
   [promesa.core :as p]
   shutdown
   state
   [taoensso.timbre :as timbre]
   [taoensso.timbre.appenders.core :as appenders]
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

(defn log! [level args fmeta]
  (timbre/log! level :p args {:?line (:line fmeta)
                              :?file (:file fmeta)
                              :?ns-str (:ns-str fmeta)}))

(defn ^:private exit-server [server]
  (logger/info "Exiting...")
  (lsp.server/shutdown server) ;; blocks, waiting up to 10s for previously received messages to be processed
  (shutdown-agents)
  (System/exit 0))

(defmethod lsp.server/receive-notification "exit" [_ {:keys [server]} _params]
  (exit-server server))

(defmethod lsp.server/receive-request "ping" [_ _ _]
  {})

(defmethod lsp.server/receive-request "initialize" [_ {:keys [db*]} params]
  (logger/info "Initializing " params)

  ;; merges client-info capabilities and client protocol-version
  (swap! db* merge params)
  {:protocol-version "2024-11-05"
   :capabilities {:prompts {:listChanged true}
                  :tools {:listChanged true}
                  :resources {}}
   :server-info {:name "docker-mcp-server"
                 :version "0.0.1"}})

(defmethod lsp.server/receive-notification "notifications/initialized" [_ _ _]
  (logger/info "Initialized!"))

; level is debug info notice warning error critical alert emergency
(defmethod lsp.server/receive-request "logging/setLevel" [_ {:keys [logger db*]} {:keys [level]}]
  (swap! db* assoc :mcp.log/level level)
  {})

;; server features
(defmethod lsp.server/receive-request "completion/complete" [_ _ _]
  {:completion {:values []
                :total 0
                :hasMore false}})

(defn entry->prompt-listing [k v _messages]
  (merge
   {:name (str k)}
   (select-keys (:metadata v) [:description :arguments])))

(defmethod lsp.server/receive-request "prompts/list" [_ {:keys [db*]} params]
  ;; TODO might contain a cursor
  (logger/info "prompts/list" params)
  (let [prompts
        {:prompts (->> (:mcp.prompts/registry @db*)
                       (mapcat
                        (fn [[k v]] (map (partial entry->prompt-listing k v) (:messages v))))
                       (into []))}]
    (logger/info prompts)
    prompts))

(defmethod lsp.server/receive-request "prompts/get" [_ {:keys [db*]} {:keys [name arguments]}]
  (logger/info "prompts/get " name)
  (let [{:keys [prompt-function metadata]} (-> @db* :mcp.prompts/registry (get name))]
    {:description (or (:description metadata) name)
     :messages (prompt-function (or arguments {}))}))

(defmethod lsp.server/receive-request "resources/list" [_ _ _]
  (logger/info "resources/list")
  {:resources []})

(defmethod lsp.server/receive-request "resources/read" [_ _ params]
  (logger/info "resouces/read" params)
  {:contents []})

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

(defmethod lsp.server/receive-request "tools/list" [_ {:keys [db*]} _]
  ;; TODO cursors
  (logger/info "tools/list")
  {:tools (->> (:mcp.prompts/registry @db*)
               (vals)
               (mapcat :functions)
               (map (fn [m] (-> (:function m)
                                (select-keys [:name :description])
                                (assoc :inputSchema (or (-> m :function :parameters) {:type "object" :properties {}})))))
               (into []))})

(defn mcp-tool-calls
  " params
      db* - uses mcp.prompts/registry and host-dir
      params - tools/call mcp params"
  [db* params]
  (volumes/with-volume
    (fn [thread-id]
      (concat
       [{:type "text"
         :text (->>
                (tools/make-tool-calls
                 0
                 (partial
                  tools/function-handler
                  {:functions (->> @db* :mcp.prompts/registry vals (mapcat :functions))
                   :host-dir (-> @db* :host-dir)
                   :thread-id thread-id})
                 [{:function (update params :arguments (fn [arguments] (json/generate-string arguments))) :id "1"}])
                (async/reduce conj [])
                (async/<!!)
                (map :content)
                (apply str))}]
       (volumes/pick-up-mcp-resources thread-id)))))

(defmethod lsp.server/receive-request "tools/call" [_ {:keys [db*]} params]
  (logger/info "tools/call")
  (logger/info "with params" params)
  (lsp.server/discarding-stdout
   (let [content (mcp-tool-calls db* params)]
     (logger/info "content " (with-out-str (pprint/pprint content)))
     ;; TODO with mcp, tool-calls with errors can be explicit
     {:content content
      :is-error false})))

(defmethod lsp.server/receive-request "docker/prompts/register" [_ {:keys [db* id]} params]
  (logger/info "docker/prompts/register"))

(defmethod lsp.server/receive-request "docker/prompts/run"
  [_ {:keys [db* id] :as components} {:keys [thread-id] {:keys [file content uri]} :prompts :as params}]
  (lsp.server/discarding-stdout
   (let [conversation-id (str (java.util.UUID/randomUUID))
         prompt-string (cond
                         file (slurp file)
                         content content
                         uri (slurp (git/prompt-file uri)))]
     (swap! db* update-in [:mcp/conversations] (fnil assoc {}) conversation-id
            {:state-promise
             (p/create
              (fn [resolve reject]
                (resolve
                 (async/<!!
                  (volumes/with-volume
                    (fn [thread-id]
                      (let [m (-> {}
                                  (assoc-in [:opts :conversation-id] conversation-id)
                                  (assoc-in [:opts :thread-id] thread-id)
                                  (assoc-in [:opts :prompt-content] prompt-string)
                                  (state/construct-initial-state-from-prompts))]
                        (graph/stream
                         (if (-> m :metadata :agent)
                           ((graph/require-graph (-> m :metadata :agent)) m)
                           (graph/chat-with-tools m))
                         m)))
                    (if thread-id
                      {:thread-id thread-id :save-thread-volume false}
                      {}))))))})
     {:conversation-id conversation-id})))

(defn ^:private monitor-server-logs [log-ch]
  ;; NOTE: if this were moved to `initialize`, after timbre has been configured,
  ;; the server's startup logs and traces would appear in the regular log file
  ;; instead of the temp log file. We don't do this though because if anything
  ;; bad happened before `initialize`, we wouldn't get any logs.
  (async/go-loop []
    (when-let [log-args (async/<! log-ch)]
      (apply log-wrapper-fn log-args)
      (recur))))

(defrecord TimbreLogger []
  logger/ILogger
  (setup [this]
    (fs/create-dirs (fs/file "/prompts" "log"))
    (let [log-path (str (fs/file "/prompts/log/docker-mcp-server.out"))]
      (timbre/merge-config! {:middleware [#(assoc % :hostname_ "")]
                             :appenders {:println {:enabled? false}
                                         :spit (appenders/spit-appender {:fname log-path})}})
      (timbre/handle-uncaught-jvm-exceptions!)
      (logger/set-logger! this)
      log-path))

  (set-log-path [_this log-path]
    (timbre/merge-config! {:appenders {:spit (appenders/spit-appender {:fname log-path})}}))

  (-info [_this fmeta arg1] (log! :info [arg1] fmeta))
  (-info [_this fmeta arg1 arg2] (log! :info [arg1 arg2] fmeta))
  (-info [_this fmeta arg1 arg2 arg3] (log! :info [arg1 arg2 arg3] fmeta))
  (-warn [_this fmeta arg1] (log! :warn [arg1] fmeta))
  (-warn [_this fmeta arg1 arg2] (log! :warn [arg1 arg2] fmeta))
  (-warn [_this fmeta arg1 arg2 arg3] (log! :warn [arg1 arg2 arg3] fmeta))
  (-error [_this fmeta arg1] (log! :error [arg1] fmeta))
  (-error [_this fmeta arg1 arg2] (log! :error [arg1 arg2] fmeta))
  (-error [_this fmeta arg1 arg2 arg3] (log! :error [arg1 arg2 arg3] fmeta))
  (-debug [_this fmeta arg1] (log! :debug [arg1] fmeta))
  (-debug [_this fmeta arg1 arg2] (log! :debug [arg1 arg2] fmeta))
  (-debug [_this fmeta arg1 arg2 arg3] (log! :debug [arg1 arg2 arg3] fmeta)))

(defrecord ^:private McpProducer
           [server db*]
  producer/IProducer

  (publish-exit [_this p]
    (logger/info "publish-exit " p)
    (lsp.server/discarding-stdout
     (->> p (lsp.server/send-notification server "$/exit"))))
  ; params is a map of progressToken, progress, and total
  (publish-progress [_this params]
    (lsp.server/discarding-stdout
     (->> params (lsp.server/send-notification server "notifications/progress"))))
  ; params is a map of level, logger, data
  ; level is debug info notice warning error critical alert emergency
  (publish-log [_this params]
    (->> params (lsp.server/send-notification server "notifications/message")))

  (publish-prompt-list-changed [_ params]
    (logger/info "send prompt list changed")
    (->> params (lsp.server/send-notification server "notifications/prompts/list_changed")))

  (publish-resource-list-changed [_ params]
    (->> params (lsp.server/send-notification server "notifications/resources/list_changed")))

  (publish-resource-updated [_ params]
    (->> params (lsp.server/send-notification server "notifications/resources/updated")))

  (publish-tool-list-changed [_ params]
    (logger/info "send tool list changed")
    (->> params (lsp.server/send-notification server "notifications/tools/list_changed")))
  (publish-docker-notify [_ method params]
    (lsp.server/send-notification server method params)))

(def registry "/prompts/registry.yaml")

(defn run-server! [{:keys [trace-level] :or {trace-level "off"} :as opts}]
  (lsp.server/discarding-stdout
   (let [timbre-logger (->TimbreLogger)
         log-path (logger/setup timbre-logger)
         db* db/db*
         log-ch (async/chan (async/sliding-buffer 20))
         ;; server will start watching stdio/stdout immediately
         server (stdio-server
                 (merge
                  {;:keyword-function identity
                   :in (or (:in opts) System/in)
                   :out System/out
                   :log-ch log-ch
                   :trace-ch log-ch
                   :trace-level trace-level}
                  (when (:mcp opts)
                    {:in-chan-factory io-chan/mcp-input-stream->input-chan
                     :out-chan-factory io-chan/mcp-output-stream->output-chan})))
         producer (McpProducer. server db*)
         components {:db* db*
                     :logger timbre-logger
                     :producer producer
                     :server server}]
     (swap! db* merge {:log-path log-path} (dissoc opts :in))
     ;; register static prompts
     (db/add-refs
       (concat
         (->> (:register opts)
              (map (fn [ref] [:static ref])))
         ;; register dynamic prompts
         (when (fs/exists? (fs/file registry))
           (db/registry-refs registry))))
     ;; watch dynamic prompts in background
     (async/thread
       (let [{x :container}
             (docker/run-streaming-function-with-no-stdin
              {:image "vonwig/inotifywait:latest"
               :volumes ["docker-prompts:/prompts"]
               :command ["-e" "create" "-e" "modify" "-e" "delete" "-q" "-m" "/prompts"]}
              (fn [line]
                (logger/info "registry changed" line)
                (let [[_dir _event f] (string/split line #"\s+")]
                  (when (= f "registry.yaml")
                    (try
                      (db/add-refs (logger/trace (into [] (db/registry-refs registry))))
                      (producer/publish-tool-list-changed producer {})
                      (producer/publish-prompt-list-changed producer {})
                      (catch Throwable t
                        (logger/error t "unable to parse registry.yaml")))))))]
         (shutdown/schedule-container-shutdown
          (fn []
            (logger/info "inotifywait shutting down")
            (docker/kill-container x)
            (docker/delete x)))))
     (monitor-server-logs log-ch)
     (logger/info "Starting server...")
     ;; only on lsp.server/start will the stdio channels start being used
     [producer (lsp.server/start server components)])))

(comment
  (def stuff (user-loop/create-pipe))
  (def x (run-server! {:trace-level "off" :in (second stuff) :host-dir "/Users/slim/docker/labs-ai-tools-for-devs"}))
  (alter-var-root
   #'jsonrpc/notify
   (constantly
    (fn [method params]
      (jsonrpc.producer/publish-docker-notify (first x) method params))))
  ;; --------------------
  ;; register
  ;; --------------------
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "docker/prompts/register"
    :id "4"
    :params {:prompts "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md&ref=slim/server"}})
  (pprint/pprint @db/db*)
  ;; --------------------
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "prompts/list"
    :id "5"
    :params {}})
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "tools/list"
    :id "5"
    :params {}})
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "prompts/get"
    :id "5"
    :params {:name "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md&ref=slim/server"}})
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "tools/call"
    :id "5"
    :params {:name "cat_file"
             :arguments {:path "./Dockerfile"}}})
  ;; --------------------
  ((-> stuff first first)
   {:jsonrpc "2.0"
    :method "docker/prompts/run"
    :id "4"
    :params {:prompts {:content "\n# prompt user\nHow are you?\n"}}})
  (->>
   (->
    (:db* (first x))
    (deref)
    :mcp/conversations)
   vals
   (map :state-promise)
   (map deref)))


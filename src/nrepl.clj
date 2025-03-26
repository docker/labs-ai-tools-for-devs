(ns nrepl
  (:require
   [borkdude.dynaload :refer [dynaload]]
   [jsonrpc.logger :as logger]))

(set! *warn-on-reflection* true)

(def start-server (dynaload 'nrepl.server/start-server))

(def cider-nrepl-handler (dynaload 'cider.nrepl/cider-nrepl-handler))

(defn ^:private repl-port []
  (if (.get (System/getenv) "IN_DOCKER")
    (let [port 1667]
      (start-server :handler cider-nrepl-handler :bind "0.0.0.0" :port port)
      port)
    (:port (start-server :handler cider-nrepl-handler))))

(defn setup-nrepl []
  (try
    (when-let [port (repl-port)]
      (logger/info "====== mcp/docker nrepl server started on port" port)
      port)
    (catch Throwable _
      (logger/debug "nrepl not found, skipping nrepl server start...")
      nil)))


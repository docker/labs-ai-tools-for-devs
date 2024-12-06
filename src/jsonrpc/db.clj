(ns jsonrpc.db 
  (:require
   git
   [jsonrpc.logger :as logger]
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [register] :as opts}]
  (let [f (git/prompt-file register)
        {:keys [messages metadata functions] :as entry} (prompts/get-prompts (assoc opts :prompts f))]
    entry))

(defn add [opts]
  (logger/info "adding prompts" (:register opts))
  (let [m (get-prompt-data opts)]
    (swap! db* update-in [:mcp.prompts/registry] 
           (fnil assoc {}) 
           #_(:register opts) 
           (or (-> m :metadata :name) (:register opts))
           m)))

(comment
  (add {:register "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md&ref=slim/server"}))


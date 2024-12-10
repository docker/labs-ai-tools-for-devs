(ns jsonrpc.db 
  (:require
   git
   [jsonrpc.logger :as logger]
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [register] :as opts}]
  (->> register
       (map (fn [ref] [ref (git/prompt-file ref)]))
       (map (fn [[ref f]]
              (let [m (prompts/get-prompts (assoc opts :prompts f))]
                [(or (-> m :metadata :name) ref) m])))
       (into {})))

(defn add [opts]
  (logger/info "adding prompts" (:register opts))
  (let [m (get-prompt-data opts)]
    (swap! db* update-in [:mcp.prompts/registry] (fnil merge {}) m)))

(comment
  (add {:register ["github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md"
                   "github:docker/labs-ai-tools-for-devs?path=prompts/examples/hello_world.md"]}))


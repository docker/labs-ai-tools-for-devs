(ns jsonrpc.db 
  (:require
   git
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [prompts] :as opts}]
  (let [f (git/prompt-file prompts)
        {:keys [messages metadata functions] :as entry} (prompts/get-prompts (assoc opts :prompts f))]
    entry))

(defn add [opts]
  (swap! db* update-in [:mcp.prompts/registry] (fnil assoc {}) (:prompts opts) (get-prompt-data opts)))

(comment
  (add {:prompts "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md&ref=slim/server"}))


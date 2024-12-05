(ns jsonrpc.db 
  (:require
   git
   [jsonrpc.logger :as logger]
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [prompts] :as opts}]
  (let [f (if (string? prompts) (git/prompt-file prompts) prompts)
        {:keys [messages metadata functions] :as entry} (prompts/get-prompts (assoc opts :prompts f))]
    entry))

(defn add [opts]
  (logger/info "adding prompts" (:prompts opts))
  (swap! db* update-in [:mcp.prompts/registry] (fnil assoc {}) (:prompts opts) (get-prompt-data opts)))

(comment
  (add {:prompts "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md&ref=slim/server"}))


(ns jsonrpc.extras 
  (:require
   [clojure.core.async :as async]
   git
   graph
   [jsonrpc.logger :as logger]
   [lsp4clj.server :as lsp.server]
   [promesa.core :as p]
   state
   volumes))

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


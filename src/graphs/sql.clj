(ns graphs.sql
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.string :as string]
   [graph]
   state))

(def first-tool-call
  {:messages [{:role "assistant"
               :content ""
               :tool_calls [{:type "function"
                             :function {:name "sql_db_list_tables_tool"
                                        :arguments "{\"database\": \"./Chinook.db\"}"}
                             :id "tool_abc123"}]}]
   :tools [{:type "function"
            :function {:name "sql_db_list_tables_tool"
                       :description "List all tables in the database"
                       :parameters
                       {:type "object"
                        :properties
                        {:database {:type "string" :description "the database to query"}}}
                       :container
                       {:image "vonwig/sqlite:latest"
                        :command ["{{database}}" ".tables"]}}}]})

(def model-get-schema
  {:tools [{:type "function"
            :function {:name "sql_db_get_schema_tool"
                       :description "List all tables in the database"
                       :parameters
                       {:type "object"
                        :properties
                        {:database {:type "string" :description "the database to query"}
                         :table {:type "string" :description "the table to get the schema for"}}}
                       :container
                       {:image "vonwig/sqlite:latest"
                        :command ["{{database}}" ".schema {{table}}"]}}}]})

(defn failed-tool-call-message [tool-call-name]
  ;; this is awful - binds the should-continue edge to the format of this string
  (format
   "Error: The wrong tool was called: %s. Please fix your mistakes. Remember to only call SubmitFinalAnswer to submit the final answer. Generated queries should be outputted WITHOUT a tool call."
   tool-call-name))

(defn query-gen
  "Assistant+Tool Node: has it's own prompt but also adds checks for proper final answers"
  [state]
  (async/go
    (let [x ((graph/apply-functions
              [(state/messages-reset)
               (state/tools-reset)
               (state/messages-from-prompt "github:docker/labs-ai-tools-for-devs?path=prompts/sql/query-gen.md")
               (state/messages-append-all)]) state)
          {:keys [messages _finish-reason]} (async/<! (graph/run-llm x))]

      ; check for bad tool_calls and create failed Tool messages for them 
      {:messages
       (concat
        messages
        (->> (:tool_calls (last messages))
             (filter (complement #(= "SubmitFinalAnswer" (-> % :function :name))))
             (map (fn [{:keys [id] :as tc}]
                    {:role "tool"
                     :content (failed-tool-call-message (-> tc :function :name))
                     :tool_call_id id}))))})))

(defn summary [{:keys [messages]}]
  (async/go
    (let [[{:keys [id] :as tc}] (:tool_calls (last messages))
          content (-> tc :function :arguments (json/parse-string) (get "final_answer"))]
      {:messages [{:role "tool"
                   :content (or content (str tc))
                   :tool_call_id id}
                  {:role "assistant"
                   :content (or content (str tc))}]})))

(defn should-continue
  "end, correct-query, or query-gen"
  [{:keys [messages]}]
  (let [last-message (last messages)]
    (cond
      (contains? last-message :tool_calls) "summary"
      ;; prevent inifinite loops of errors
      (string/starts-with? (:content last-message) "Error:") "query-gen"
      ;; how many times should we try to correct because correct-query will always end up back here 
      :else "correct-query")))

(defn graph [_]
  (graph/construct-graph
   [[["start"                   graph/start]
     ["list-tables-tool"        (graph/sub-graph-node
                                 {:init-state
                                  [#(assoc %2 :finish-reason "tool_calls")
                                   (state/tools-set (:tools first-tool-call))
                                   (state/messages-append (:messages first-tool-call))]
                                  :construct-graph graph/generate-start-with-tool
                                  :next-state (state/take-last-messages 2)})]
     ["model-get-schema"        (graph/sub-graph-node
                                 {:init-state
                                  [(state/tools-append (:tools model-get-schema))]
                                  :next-state state/append-new-messages})]
     ["query-gen"               query-gen]
     [:edge                     should-continue]]
    [["correct-query"           (graph/sub-graph-node
                                 {:init-state
                                  [(state/messages-reset)
                                   (state/messages-from-prompt "github:docker/labs-ai-tools-for-devs?path=prompts/sql/query-check.md")
                                   (state/messages-take 1)
                                   (state/messages-take-last 1)]
                                  :construct-graph graph/generate-one-tool-call
                                  :next-state state/append-new-messages})]
     ["query-gen"]]
    [["summary"                 summary]
     ["end"                     graph/end]]]))


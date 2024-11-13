(ns graphs.sql
  (:require
   [babashka.fs :as fs]
   [clojure.core.async :as async]
   [clojure.string :as string]
   [graph]))

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

(defn list-tables-inject-tool [_]
  (async/go
    first-tool-call))

(defn failed-tool-call-message [tool-call-name]
  ;; this is awful - binds the should-continue edge to the format of this string
  (format
   "Error: The wrong tool was called: %s. Please fix your mistakes. Remember to only call SubmitFinalAnswer to submit the final answer. Generated queries should be outputted WITHOUT a tool call."
   tool-call-name))

(defn query-gen
  "Assistant+Tool Node: has it's own prompt but also adds checks for proper final answers"
  [state]
  (async/go
    (let [x (->
             state
             (dissoc :messages)
             (dissoc :functions)
             (update-in [:opts :level] (fnil inc 0))
             (update-in [:opts :prompts] (constantly (fs/file "prompts/sql/query-gen.md")))
             (graph/construct-initial-state-from-prompts)
             (update-in [:messages] concat (:messages state)))
          {:keys [messages _finish-reason]} (async/<! (graph/run-llm
                                                       (:messages x)
                                                       (dissoc (:metadata x) :agent)
                                                       (:functions x)
                                                       (:opts x)))]

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

(defn should-continue
  "end, correct-query, or query-gen"
  [{:keys [messages]}]
  (let [last-message (last messages)]
    (cond
      (contains? last-message :tool_calls) "end"
      (string/starts-with? (:content last-message) "Error:") "query-gen"
      :else "correct-query")))

(defn seed-get-schema-conversation [state]
  ; inherit full conversation
  ; no prompts
  ; add the schema tool
  (-> state
      (update-in [:opts :level] (fnil inc 0))
      (update-in [:opts :parameters] (constantly {:database "./Chinook.db"}))
      (update-in [:functions] (fnil concat []) (:tools model-get-schema))))

(defn seed-correct-query-conversation
  [state]
  ; make one LLM call with the last message (which should be a user query containing the SQL we want to check)
  ; add the last message to the conversation
  (-> state
      (dissoc :messages)
      (update-in [:opts :level] (fnil inc 0))
      (update-in [:opts :prompts] (constantly (fs/file "prompts/sql/query-check.md")))
      (update-in [:opts :parameters] (constantly {:database "./Chinook.db"}))
      (graph/construct-initial-state-from-prompts)
      (update-in [:messages] concat [(last (:messages state))])))

(defn graph [_]
  (graph/construct-graph
   [[["start" graph/start]
     ["list-tables-inject-tool" list-tables-inject-tool]
     ["list-tables-tool" (graph/tool-node {})]
     ["model-get-schema" (graph/sub-graph-node
                          {:init-state seed-get-schema-conversation
                           :next-state graph/append-new-messages})]
     ["query-gen" query-gen]
     [:edge should-continue]]
    [["correct-query" (graph/sub-graph-node
                       {:init-state seed-correct-query-conversation
                        :construct-graph graph/one-tool-call
                        :next-state graph/append-new-messages})]
     ["query-gen"]]
    [["end" graph/end]]]))


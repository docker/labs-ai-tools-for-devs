(ns graphs.sql
  (:require
   [clojure.core.async :as async]
   [clojure.string :as string]
   [graph]))

(def db-query-tool-call
  {:messages [{:content ""
               :tool_calls [{:name "sql_db_query_tool"
                             :arguments "{}"
                             :id "tool_abc123"}]}]
   :tools [{:name "sql_db_query_tool"
            :description "List all tables in the database"
            :parameters
            {:type "object"
             :properties
             {:database {:type "string" :description "the database to query"}
              :query {:type "string" :description "the sql statement to run"}}}
            :container
            {:image "vonwig/sqlite:latest"
             :command ["{{database}}" "{{query}}"]}}]})

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

(defn query-gen
  "Assistant+Tool Node: has it's own prompt but also adds checks for proper final answers"
  [_]
  ;; note that we should not bind tools here because the only acceptable output is a proper final answer
  ;; so this sub-graph needs to remove all tools
  )

;; TODO pull out the query check system
(defn correct-query
  "Assistant Node: double check the query 
      - should generate a tool call to execute the query"
  [_])

(defn execute-query
  "Tool Node: runs db query"
  [_])

(defn should-continue
  "end, correct-query, or query-gen"
  [{:keys [messages]}]
  (let [last-message (last messages)]
    (cond
      (contains? last-message :tool_calls) "end"
      (string/starts-with? last-message "Error:") "query-gen"
      :else "correct-query")))

(defn seed-get-schema-conversation [state]
  ; inherit full conversation
  ; no prompts
  ; add the schema tool
  (-> state
      (update-in [:opts :level] (fnil inc 0))
      (update-in [:opts :parameters] (constantly {:database "./Chinook.db"}))
      (update-in [:functions] (fnil concat []) (:tools model-get-schema))))

(defn graph [_]
  (-> {}
      (graph/add-node "start" graph/start)
      (graph/add-node "list-tables-inject-tool" list-tables-inject-tool)
      (graph/add-edge "start" "list-tables-inject-tool")

      (graph/add-node "list-tables-tool" (graph/tool-node nil))
      (graph/add-edge "list-tables-inject-tool" "list-tables-tool")

      (graph/add-node "model-get-schema" (graph/sub-graph-node {:init-state seed-get-schema-conversation}))       ; assistant
      (graph/add-edge "list-tables-tool" "model-get-schema")

      (graph/add-node "end" graph/end)
      (graph/add-edge "model-get-schema" "end")
      ;(graph/add-node "query-gen" query-gen)                     ; assistant - might just end if it generates the right response
                                                                 ;;           - might just loop back to query-gen if there's an error
                                                                 ;;           - otherwise switch to correct-query

      ;(graph/add-node "correct-query" correct-query)             ; assistant 
      ;(graph/add-node "execute-query" execute-query)             ; tool

      ;(graph/add-edge "list-table-sub-graph" "model-get-schema")
      ;(graph/add-edge "model-get-schema" "query-gen")
      ;(graph/add-conditional-edges "query-gen" should-continue)

      ;(graph/add-edge "correct-query" "execute-query")
      ;(graph/add-edge "execute-query" "query-gen")
      ))

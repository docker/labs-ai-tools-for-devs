(ns graph_t
  (:require
   [babashka.fs :as fs]
   [clojure.core.async :as async]
   [clojure.test :as t]
   [graph]
   [graphs.sql]
   jsonrpc
   state))

(t/deftest
  (graph/construct-graph graph/chat-with-tools-representation)
  (graph/construct-graph graphs.sql/graph))

(comment
  ;; requires network to test
  (state/add-prompt-ref
   {:messages [{:tool_calls [{:function {:name "sql_db_list_tables"
                                         :arguments "{\"arg\": 1}"}}]}]
    :functions [{:function {:name "sql_db_list_tables"
                            :description "List all tables in the database"
                            :parameters {:type "object"
                                         :properties
                                         {:database {:type "string" :description "the database to query"}}}
                            :ref "github:docker/labs-ai-tools-for-devs?path=prompts/curl/README.md"}}]}))

(comment
  (alter-var-root #'jsonrpc/notify (fn [_] (partial jsonrpc/-println {:debug true})))
  (let [x {:prompts (fs/file "/Users/slim/docker/labs-ai-tools-for-devs/prompts/curl/README.md")
           :platform "darwin"
           :user "jimclark106"
           :thread-id "thread"
           :host-dir "/Users/slim"
           :stream true}]
    (state/summarize (async/<!! (graph/stream (graph/chat-with-tools x) x)))))

(comment
  (def x {:stream true,
          :host-dir "/Users/slim/docker/labs-make-runbook",
          :prompts "/Users/slim/docker/labs-ai-tools-for-devs/prompts/hub/default.md"
          :platform "darwin", :user "jimclark106",
          :thread-id "3e61ffe7-840e-4177-b84a-f6f7db58b24d"})
  (state/summarize
   (async/<!! (graph/stream (graph/chat-with-tools x) x))))



(ns graph_t
  (:require [clojure.test :as t]
            [graph]
            [graphs.sql]))

(t/deftest
  (graph/construct-graph graph/chat-with-tools-representation)
  (graph/construct-graph graphs.sql/graph-data))

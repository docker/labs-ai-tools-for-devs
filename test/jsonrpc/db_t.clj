(ns jsonrpc.db-t
  (:require
   [babashka.fs :as fs]
   [clojure.pprint :refer [pprint]]
   [clojure.test :as t]
   [jsonrpc.db :as db]
   [jsonrpc.producer :as producer]
   jsonrpc.server
   [lsp4clj.server :as server]))

(def correct-refs
  [ [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/hello_world.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/curl.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/qrencode.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/mcp-sqlite.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/explain_dockerfile.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/ffmpeg.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?path=prompts/examples/mcp-memory.md"]
 [:dynamic
  "github:docker/labs-ai-tools-for-devs?path=prompts/lorax/speculative.md"]])

(t/deftest registry-ref-tests
  (t/testing "parse-registry"
    (t/is (= correct-refs
             (db/registry-refs "test/registry.yaml")))))

(comment
  (do
    (db/add-refs
      (concat
        (->> []
             (map (fn [ref] [:static ref])))
        ;; register dynamic prompts
        (when (fs/exists? (fs/file "test/registry.yaml"))
          (db/registry-refs "test/registry.yaml"))))
    (->> @db/db*
         :mcp.prompts/registry
         vals
         )
    (get-in (deref db/db*) [:mcp.prompts/registry "curl"])
    (server/receive-request "prompts/list" {:db* db/db*} {})
    (server/receive-request 
      "prompts/get" 
      {:db* db/db*} 
      {:name "curl:fetch gists" :arguments {:user "slimslender"}})))

(comment
  (db/add-refs 
    (db/registry-refs "test/registry.yaml"))

  (db/add-refs
    [[:dynamic "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md"]
     [:dynamic "github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile1.md"]
     [:dynamic "github:docker/labs-ai-tools-for-devs?ref=branch&path=prompts/examples/explain_dockerfile1.md"]
     [:dynamic "github:docker/labs-ai-tools-for-devs?ref=branch&path=prompts/examples/explain_dockerfile1.md"]]))

(comment
  (pprint @db/db*))

(comment
  (def hey
    (atom
     {:mcp.prompts/resources
      {"memo://insights"
       {:uri "memo://insights"
        :text "No Business Insights"
        :matches "resource:///thread/insights.txt"}}}))
  (jsonrpc.server/update-resources
   {:db* hey
    :producer (reify producer/IProducer (publish-resource-list-changed [_ _] (println "called")))}
   [{:resource {:uri "resource:///thread/insights.txt" :text "updated"}}]))

(comment
  (jsonrpc.server/update-matched-resources
   {"memo://insights" {:uri "memo://insights" :text "No Business Insights" :matches "resource:///thread/insights.txt"}}
   [{:resource {:uri "resource:///thread/insights.txt" :text "updated"}}]))

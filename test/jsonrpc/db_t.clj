(ns jsonrpc.db-t
  (:require
   [babashka.fs :as fs]
   [clojure.pprint :refer [pprint]]
   [clojure.test :as t]
   [jsonrpc.db :as db]
   [lsp4clj.server :as server]))

(def correct-refs
  [[:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/hello_world.md"]
   [:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/mcp-sqlite.md"]
   [:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/curl.md"]
   [:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/ffmpeg.md"]
   [:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/explain_dockerfile.md"]
   [:dynamic
    "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/qrencode.md"]])

(t/deftest registry-ref-tests
  (t/testing "parse-registry"
    (t/is (= correct-refs
             (db/registry-refs "test/registry.yaml")))))

(let []
  (db/add-refs
      (concat
       (->> []
            (map (fn [ref] [:static ref])))
         ;; register dynamic prompts
       (when (fs/exists? (fs/file "test/registry.yaml"))
         (db/registry-refs "test/registry.yaml"))))
  (server/receive-request "prompts/list" {:db* db*} {}))

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

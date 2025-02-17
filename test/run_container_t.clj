(ns run-container-t
  (:require
   [cheshire.core :as json]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [clojure.test :as t]
   [docker]))

(t/deftest run-container-with-stdin-tests
  (t/is (=
         (-> (docker/run-container
              {:image "docker/lsp:treesitter"
               :stdin {:content "---\ntools:\n---\n\n# okay\n\n"}})
             :pty-output
             (edn/read-string)
             first)
         "document"))
  (t/is
   (string/starts-with?
    (-> (docker/run-container
         {:image "vonwig/websocat:latest",
          :stdin
          {:content
           "Page.navigate {\"url\":\"https://www.docker.com\"}"},
          :command
          ["-n1"
           "--jsonrpc"
           "--jsonrpc-omit-jsonrpc"
           "http://host.docker.internal:9222/devtools/page/A27C1705A771414EB6647777F1625F6A"]})
        :pty-output)
    "Specify ws:")))

(comment

  (docker/is-logged-in? {})
  (docker/get-token {})
  (docker/get-login-info {})
  (docker/get-login-info-from-desktop-backend)
  (docker/images {})

  (def sample {:image "docker/lsp:latest"
               :entrypoint "/app/result/bin/docker-lsp"
               :command ["project-facts"
                         "--vs-machine-id" "none"
                         "--workspace" "/docker"]})
  (pprint
   (json/parse-string
    (docker/run-container
     (assoc sample
            :host-dir "/Users/slim/docker/genai-stack"
            :user "jimclark106")) keyword))
  (docker/delete-image {:image "vonwig/go-linguist:latest"})
  (pprint
   (docker/run-container {:image "vonwig/go-linguist:latest"
                          :timeout 10000
                          :command ["-json"]
                          :host-dir "/Users/slim/docker/labs-make-runbook"
                          :user "jimclark106"}))
  (pprint
   (json/parse-string
    (docker/run-container
     {:image "vonwig/extractor-node:latest"
      :host-dir "/Users/slim/docker/labs-make-runbook"})
    keyword)))

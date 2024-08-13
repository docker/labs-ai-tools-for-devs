(ns prompts-t
  (:require [clojure.test :as t]
            [babashka.fs :as fs]
            [prompts]
            [pogonos.partials :as partials]))

(t/deftest render-partials
  (t/is
   (.startsWith
    (->
     (#'prompts/selma-render
      "prompts/dockerfiles"
      {}
      "prompts/dockerfiles/020_system_prompt.md")
     first
     :content)
    "\nWrite Dockerfiles")))

;; test requires that vonwig/go-linguist:latest is already
;; pulled
(t/deftest fact-reducer-tests
  (t/is
   (=
    (->>
     (prompts/fact-reducer "/Users/slim/docker/labs-make-runbook"
                           {}
                           {:name "go-linguist"
                            :image "vonwig/go-linguist:latest"
                            :command ["-json"]
                            :output-handler "linguist"
                            :user "jimclark106"
                            :offline true})
     :linguist
     (map :language)
     (into #{}))
    (into #{}
          '("Coq" "Ignore List" "JSON" "JSON with Comments" "JavaScript" "Markdown" "TypeScript" "YAML")))))

(t/deftest extractors
  (t/is
   (=
    (prompts/collect-extractors "prompts/docker")
    '({:name "project-facts", :image "docker/lsp:latest", :entrypoint "/app/result/bin/docker-lsp", :command ["project-facts" "--vs-machine-id" "none" "--workspace" "/docker"]})))
  (t/is
   (=
    (prompts/collect-extractors "prompts/dockerfiles")
    '({:name "go-linguist", :image "vonwig/go-linguist:latest", :command ["-json"], :output-handler "linguist"}))))

(comment
  (prompts/run-extractors
    {:host-dir "/Users/slim/docker/labs-ai-tools-for-devs/"
     :user "jimclark106"
     :prompts-dir (fs/file "prompts/docker")})
  (prompts/collect-functions (fs/file "prompts/dockerfiles"))
  (prompts/collect-extractors (fs/file "prompts/docker"))
  )


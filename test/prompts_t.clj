(ns prompts-t
  (:require [clojure.test :as t]
            [babashka.fs :as fs]
            [prompts]
            [markdown]
            [pogonos.partials :as partials]))

(def not-nil? (comp not nil?))

(t/deftest prompt-patterns
  (t/are [x y] (x y)
    nil? (re-matches markdown/prompt-pattern "#prompt user ")
    not-nil? (re-matches markdown/prompt-pattern "prompt user ")
    not-nil? (re-matches markdown/prompt-pattern "Prompt user ")
    nil? (re-matches markdown/prompt-pattern "prompt ")
    not-nil? (re-matches markdown/prompt-pattern "prompt user")
    nil? (re-matches markdown/prompt-pattern "xprompt user ")))

(t/deftest render-partials
  (t/is
   (.startsWith
    (->
     (#'prompts/selma-render
      (fs/file "prompts/dockerfiles")
      {}
      {:role "system" :content (slurp "prompts/dockerfiles/020_system_prompt.md")})
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
                           {:name "linguist"
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
    '({:name "project-facts", :image "docker/lsp:latest", :entrypoint "/app/result/bin/docker-lsp", :command ["project-facts" "--vs-machine-id" "none" "--workspace" "/project"]})))
  (t/is
   (=
    (prompts/collect-extractors "prompts/dockerfiles")
    '({:name "linguist", :image "vonwig/go-linguist:latest", :command ["-json"], :output-handler "linguist"}))))

(comment
  (prompts/run-extractors
   {:host-dir "/Users/slim/docker/labs-ai-tools-for-devs/"
    :user "jimclark106"
    :prompts (fs/file "prompts/docker")})
  (prompts/collect-functions (fs/file "prompts/dockerfiles"))
  (prompts/collect-extractors (fs/file "prompts/docker")))


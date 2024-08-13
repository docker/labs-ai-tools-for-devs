(ns cli
  (:require
   [clojure.tools.cli :as tools.cli]
   [clojure.test :as t]
   [prompts]))

(select-keys
 (tools.cli/parse-opts
  ["--platform" "Darwin"
   "--prompts-dir" "/Users/slim"
   "--thread-id" "anything"] prompts/cli-opts) 
 [:options :errors])

(select-keys
 (tools.cli/parse-opts
  ["--platform" "Darwin"
   "--prompts-dir" "/Users/slime"
   "--thread-id" "anything"] prompts/cli-opts) 
 [:options :errors])

(select-keys
 (tools.cli/parse-opts
  ["--platform" "Darwin"
   "--prompts" "github:docker/labs-make-runbook"
   "--thread-id" "anything"] prompts/cli-opts) 
 [:options :errors])

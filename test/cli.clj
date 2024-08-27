(ns cli
  (:require
   [clojure.tools.cli :as tools.cli]
   [clojure.test :as t]
   [prompts]))

;; TODO these tests require access to GitHub and the filesystem 
;; checks are not yet mocked
(t/deftest cli-opts
  (t/is
    (=
     {:options {:stream true, :platform "Darwin", :prompts (java.io.File. "/Users/slim"), :thread-id "anything", :save-thread-volume true}, :errors nil}
     (select-keys
       (tools.cli/parse-opts
         ["--platform" "Darwin"
          "--prompts-dir" "/Users/slim"
          "--thread-id" "anything"] prompts/cli-opts) 
       [:options :errors])))
  (t/is
    (= 1
       (->
         (tools.cli/parse-opts
           ["--platform" "Darwin"
            "--prompts-dir" "/Users/slime"
            "--thread-id" "anything"] prompts/cli-opts)
         :errors
         count)))
  (t/is
    (->
      (tools.cli/parse-opts
        ["--platform" "Darwin"
         "--prompts" "github:docker/labs-make-runbook"
         "--thread-id" "anything"] prompts/cli-opts) 
      :options
      :prompts
      (.exists))))

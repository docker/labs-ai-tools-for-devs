(ns prompts.core 
  (:require
   [babashka.fs :as fs]))

(defn get-prompts-dir []
  (if (fs/exists? (fs/file "/prompts"))
    "/prompts"
    (format "%s/prompts" (System/getenv "HOME"))))

(def registry "/prompts/registry.yaml")


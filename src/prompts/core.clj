(ns prompts.core 
  (:require
   [babashka.fs :as fs]
   dir))

(set! *warn-on-reflection* true)

(defn prompts-cache []
  (let [default-dir (fs/file (System/getenv "HOME") ".prompts-cache")]
    (or
     (dir/get-dir "/prompts" default-dir)
     (do
       (fs/create-dirs default-dir)
       default-dir))))

(defn get-prompts-dir []
  (prompts-cache))

;; old registry.edn for backward compatibility
;; DEPRECATED
(def registry-file (fs/file (get-prompts-dir) "registry.edn"))

;; current registry.yaml
(def registry (fs/file (get-prompts-dir) "registry.yaml"))


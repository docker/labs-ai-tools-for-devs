(ns git.registry 
  (:require
    [babashka.fs :as fs]
    [clojure.edn :as edn]
    [dir]
    [logging :refer [warn]]))

(set! *warn-on-reflection* true)

;; registry of prompts directories stores in the docker-prompts volumes
(def registry-file (fs/file (dir/get-dir "/prompts" (fs/file (System/getenv "HOME") ".prompts-cache")) "registry.edn"))

(defn read-registry
  "read the from the prompt registry in the current engine volume"
  []
  (try
    (edn/read-string (slurp registry-file))
    (catch java.io.FileNotFoundException _
      {:prompts []})
    (catch Throwable t
      (warn "Warning (corrupt registry.edn): {{ t }}" {:exception t})
      {:prompts []})))

(defn update-registry
  "update the prompt registry in the current engine volume"
  [f]
  (spit registry-file (pr-str (f (read-registry)))))


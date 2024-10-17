(ns dir 
  (:require
   [babashka.fs :as fs]))

(set! *warn-on-reflection* true)

(defn- dir-exists? [f] (when (fs/exists? f) f))

(defn get-dir [& options]
  (some dir-exists? (map fs/file options)))


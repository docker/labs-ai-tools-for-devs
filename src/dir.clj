(ns dir 
  (:require
   [babashka.fs :as fs]))

(defn- dir-exists? [f] (when (fs/exists? f) f))

(defn get-dir [& options]
  (some dir-exists? (map fs/file options)))


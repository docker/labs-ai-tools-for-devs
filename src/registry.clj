(ns registry
  (:require [clojure.edn :as edn]
            [clojure.pprint :refer [pprint]]
            [babashka.fs :as fs]
            [dir]))

(defn- functions-dir []
  (dir/get-dir "./functions" "/app/functions"))

(defn- extractors-dir []
  (dir/get-dir "./extractors" "/app/extractors"))

(defn- get-registry [f]
  (when-let [d (f)]
    (->> (:registry (edn/read-string (slurp (fs/file d "registry.edn") )))
         (map (fn [m] [(:name m) m]))
         (into {}))))

(comment
  (pprint (get-registry functions-dir)))

(defn get-function 
  "  returns a function definition or nil"
  [{:keys [name]}]
  (get (get-registry functions-dir) name))

(defn get-extractor
  "  returns a function definition or nil"
  [{:keys [name]}]
  (get (get-registry extractors-dir) name))

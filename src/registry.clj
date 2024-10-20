(ns registry
  (:require [clojure.edn :as edn]
            [clojure.pprint :refer [pprint]]
            [babashka.fs :as fs]
            [dir]))

(set! *warn-on-reflection* true)

(defn- functions-dir []
  (dir/get-dir "./functions" "/app/result/functions" "/app/functions"))

(defn- extractors-dir []
  (dir/get-dir "./extractors" "/app/result/extractors" "/app/extractors"))

(defn- get-registry [f]
  (when-let [d (f)]
    (->> (:registry (edn/read-string (slurp (fs/file d "registry.edn") )))
         (map (fn [m] [(:name m) m]))
         (into {}))))

(defn- get-container-images [f]
  (when-let [d (f)]
    (->> (:registry (edn/read-string (slurp (fs/file d "registry.edn") )))
         (filter #(-> % :container :image))
         (map (fn [m] [(-> m :container :image) m]))
         (into {}))))

(comment
  (pprint (get-registry functions-dir)))

(defn get-function 
  "  returns a function definition or nil"
  [{:keys [name image]}]
  (or
    (get (get-registry functions-dir) name)
    (get (get-container-images functions-dir) image)))

(defn get-extractor
  "  returns a function definition or nil"
  [{:keys [name]}]
  (get (get-registry extractors-dir) name))

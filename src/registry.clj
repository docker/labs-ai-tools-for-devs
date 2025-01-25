(ns registry
  (:require [clojure.edn :as edn]
            [clojure.pprint :refer [pprint]]
            [babashka.fs :as fs]
            [dir]))

(set! *warn-on-reflection* true)

(defn- tools-dir []
  (dir/get-dir "./tools" "/app/result/tools" "/app/tools"))

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
  (pprint (get-registry tools-dir)))

(defn get-tool 
  "  returns a tool definition or nil"
  [{:keys [name image]}]
  (or
    (get (get-registry tools-dir) name)
    (get (get-container-images tools-dir) image)))

(defn get-extractor
  "  returns a extractor definition or nil"
  [{:keys [name]}]
  (get (get-registry extractors-dir) name))

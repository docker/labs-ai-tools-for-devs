(ns logging
  (:require
   [selmer.parser :as selmer]
   [selmer.util :refer [without-escaping]]))

(set! *warn-on-reflection* true)

(defn render [template data]
  (without-escaping
   (selmer/render template data)))

(defn warn [template data]
  (binding [*out* *err*]
    (println "## WARNING\n")
    (println (render template data))))

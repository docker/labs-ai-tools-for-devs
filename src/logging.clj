(ns logging 
  (:require
   [selmer.parser :as selmer]
   [selmer.util :refer [without-escaping]]))

(defn warn [template data]
  (binding [*out* *err*]
    (println "## WARNING\n")
    (println
      (without-escaping
        (selmer/render template data)))))

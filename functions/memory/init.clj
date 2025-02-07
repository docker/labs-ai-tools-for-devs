(ns init
  (:require
   [cheshire.core :as json]
   [memory]) 
  (:import
   [clojure.lang ExceptionInfo]))

(try
  (let [[s raw-json-string] *command-line-args*
        m (json/parse-string raw-json-string true)]
    (println
     ((get (ns-publics 'memory) (symbol s)) m)))
  (catch ExceptionInfo e
    (println (ex-message e))
    (System/exit 1))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " t))
      (System/exit 1))))


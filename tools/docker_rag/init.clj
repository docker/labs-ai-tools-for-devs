(ns init
  (:require
   [cheshire.core]))

(try
  (let [[json-string & extra-args] *command-line-args*
        m (cheshire.core/parse-string json-string true)
        script (first extra-args)]
    (println
      (slurp "npm-best-practices.md")))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))


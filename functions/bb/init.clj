(ns init
  (:require
   [cheshire.core]))

(def args {})

(try
  (let [[json-string & extra-args] *command-line-args*
        m (cheshire.core/parse-string json-string true)
        script (first extra-args)]
    (alter-var-root #'args (constantly m))
    (println
     (load-string script)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))


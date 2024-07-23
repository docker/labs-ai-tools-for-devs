(ns init
  (:require
   [babashka.process]
   [cheshire.core]))

(try
  (let [[json-string & args] *command-line-args*
        {llm-args :args} (cheshire.core/parse-string json-string true)]
    (println
     (-> (apply babashka.process/process
                {:out :string}
                "curl" args)
         (deref)
         (babashka.process/check)
         :out)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

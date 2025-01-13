(ns init
  (:require
   [babashka.process]
   [cheshire.core]))

(try
  (let [[json-string & args] *command-line-args*
        {llm-args :args} (cheshire.core/parse-string json-string true)]
    (println
     (-> (babashka.process/process
          {:out :string}
          (str "curl " llm-args))
         (deref)
         (babashka.process/check)
         :out)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

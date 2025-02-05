(ns init
  (:require [cheshire.core]
            [babashka.process]))

(defn run [args]
  (-> (apply babashka.process/process
             {:out :string}
             args)
      (deref)
      (babashka.process/check)
      :out))

(try
  (let [[json-string & args] *command-line-args*
        {:keys [glob]} (cheshire.core/parse-string json-string true)]
    (println
     (run
      (concat
       args
       [glob]))))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

(ns init
  (:require
   [babashka.process]
   [cheshire.core]))

(try
  (let [[json-string & args] *command-line-args*
        {:keys [url filename]} (cheshire.core/parse-string json-string true)]
    (println
     (-> (apply babashka.process/process
          {:out :string}
          ["qrencode" "-o" (format "/project/%s" filename) url])
         (deref)
         (babashka.process/check)
         :out)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

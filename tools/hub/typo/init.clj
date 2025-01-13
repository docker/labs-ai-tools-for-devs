(ns init
  (:require
   [babashka.process]
   [cheshire.core]
   [clojure.string :as string]))

(try
  (let [[json-string & args] *command-line-args*
        {:keys [files]} (cheshire.core/parse-string json-string true)]
    (println
      (or
        (-> (apply babashka.process/process
                   {:out :string
                    :in (->> files
                             (map :path)
                             (string/join "\n")) }
                   ["typos" "--diff" "--file-list" "-"])
            (deref)
            (babashka.process/check)
            :out)
        "No typos found.")))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

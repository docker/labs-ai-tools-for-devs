(ns init
  (:require [cheshire.core]
            [babashka.process]))

(defn run-gh [args]
  (-> (apply babashka.process/process
             {:out :string}
             (concat ["gh"] args))
      (deref)
      (babashka.process/check)
      :out))

(try
  (let [[json-string type] *command-line-args*
        {:keys [owner name public]} (cheshire.core/parse-string json-string true)]
    (cond
      (= type "repo-create")
      (println
        (run-gh
          (concat
            ["repo"
             "create"
             (format "%s/%s" owner name)]
            (if public ["--public"] ["--private"]))))))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))

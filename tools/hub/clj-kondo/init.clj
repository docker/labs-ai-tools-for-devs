(ns init
  (:require
   [babashka.fs :as fs]
   [babashka.process]
   [cheshire.core]))

(try
  (let [[json-string & args] *command-line-args*
        {llm-args :args} (cheshire.core/parse-string json-string true)]
    (let [{:keys [out err] :as p} (-> (apply babashka.process/process
                                             {:out :string :err :string}
                                             "clj-kondo" 
                                             (concat llm-args
                                                     ["--config" (pr-str
                                                                   {:output {:format :json}})]))
                                      (deref))]
      (let [dir (fs/file "/thread/clj-kondo")]
        (fs/create-dirs dir)
        (spit (fs/file dir "lint.json") out))
      (println out)
      (when (not (= 0 (:exit p)))
        (binding [*out* *err*]
          (println err)
          (System/exit (:exit p))))))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str t))
      (System/exit 1))))

(ns init
  (:require
   [babashka.fs :as fs]
   [babashka.process :as process]
   [cheshire.core :as json]
   [clojure.string :as string]))

(defn -command [& args]
  (try
    (let [repository (:repository (json/parse-string (second args) true))]
      (println "22-slim"))
    (catch Throwable t
      (binding [*out* *err*]
        (println t))
      (System/exit 1))))

(defn -main []
  (apply -command *command-line-args*))

(comment
  (let [args ["/Users/slim/project"
              (json/generate-string {:repository "alpine"})]]
    (apply -command args)))

(-main)


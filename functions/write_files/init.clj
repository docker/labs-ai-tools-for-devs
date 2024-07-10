(ns init
  (:require
   [babashka.fs :as fs]
   [babashka.process :as process]
   [cheshire.core :as json]
   [clojure.string :as string]))

(defn make-executable [f]
  (when (not (fs/executable? f))
    (process/sh "chmod" "+x" (str (fs/absolutize f)))))

(defn write [f s]
  (spit f s))

(defn -command [& args]
  (try
    (let [coll (:files (json/parse-string (second args) true))]
      (doseq [{:keys [path executable content]} coll :let [f (fs/file (first args) path)]]
        ;; TODO what about absolute paths - these won't work
        (write f content)
        (when executable
          (make-executable f)))
      (println (format "wrote %d files: %s" 
                       (count coll) 
                       (->> coll (map :path) (string/join ",")))))
    (catch Throwable t
      (binding [*out* *err*]
        (println t))
      (System/exit 1))))

(defn -main []
  (apply -command *command-line-args*))

(comment
  (let [args ["/Users/slim/project"
              (json/generate-string {:files [{:path "test.sh" 
                                              :executable true 
                                              :content "#!/bin/bash\necho \"Hello, World!\""}]})]]
    (apply -command args)))

(-main)


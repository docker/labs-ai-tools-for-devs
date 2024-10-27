(ns insert-tool 
  (:require
   [babashka.process :as process]
   [cheshire.core :as json]
   [clojure.string :as string]))

(comment
  ;; query
  ;; score is distance so lower is closer
  (->
    (deref
      (process/process
        {:cwd "/Users/slim/docker/labs-ai-tools-for-devs/tools_vector_store/"
         :out :string
         :err :string}
        "docker"
        "run"
        "--rm"
        "-e" (format "OPENAI_API_KEY=%s" (string/trim (slurp "/Users/slim/.openai-api-key")))
        "-v" (format "%s:%s" "/Users/slim/docker/labs-ai-tools-for-devs/tools_vector_store/chroma_db" "/app/chroma_db")
        "vonwig/tools-vector-store:local" "hola"
        ))
    :out
    (json/parse-string true)
    ))

(defn insert []
  ;; insert
  (deref
    (process/process
      {:cwd "/Users/slim/docker/labs-ai-tools-for-devs/tools_vector_store/"
       :out :string
       :err :string}
      "docker"
      "run"
      "--rm"
      "--entrypoint" "python"
      "-e" (format "OPENAI_API_KEY=%s" (string/trim (slurp "/Users/slim/.openai-api-key")))
      "-v" (format "%s:%s" "/Users/slim/docker/labs-ai-tools-for-devs/tools_vector_store/chroma_db" "/app/chroma_db")
      "vonwig/tools-vector-store:local" "insert.py"
      )))

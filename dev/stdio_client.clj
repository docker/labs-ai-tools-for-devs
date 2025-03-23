(ns stdio-client
  (:require
   [babashka.process :as process]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io])
  (:import
   [java.io BufferedOutputStream]))

(defn write [writer m]
  (.write writer (json/generate-string m))
  (.write writer "\n")
  (.flush writer))

(do
  (def server (process/process
                {:out :stream :in :stream}
                "docker" "run" "-i" "--rm" "--workdir=/app"
                "-v" "mcp-gdrive:/gdrive-server"
                "-e" "GDRIVE_CREDENTIALS_PATH=/gdrive-server/credentials.json"
                "-e" "GDRIVE_OAUTH_PATH=/secret/google.gcp-oauth.keys.json"
                "--label" "x-secret:google.gcp-oauth.keys.json=/secret/google.gcp-oauth.keys.json"
                "vonwig/gdrive:latest"))

  (async/thread
    (loop []
      (let [line (.readLine (io/reader (:out server)))]
        (when line
          (println "stdout: " line)
          (recur)))))

  (async/thread
    (loop []
      (let [line (.readLine (io/reader (:err server)))]
        (when line
          (println "stderr: " line)
          (recur)))))

  (def writer (io/writer (:in server)))

  (write writer
         {:jsonrpc "2.0"
          :method "initialize"
          :id 0
          :params {:protocolVersion "2024-11-05"
                   :capabilities {}
                   :clientInfo {:name "Stdio Client" :version "0.1"}}})
  (write writer
         {:jsonrpc "2.0" :method "notifications/initialized" :params {}}))


(write writer
       {:jsonrpc "2.0" :method "resources/list" :params {} :id 1})

(write writer
       {:jsonrpc "2.0" 
        :method "tools/call" 
        :params 
        {:name "search"
         :arguments {:query "hello"}} 
        :id "4"})

(async/thread
  (loop []
    (let [line (.readLine (io/reader (:out server)))]
      (when line
        (println "stdout: " line)
        (recur)))))

(async/thread
  (loop []
    (let [line (.readLine (io/reader (:err server)))]
      (when line
        (println "stderr: " line)
        (recur)))))


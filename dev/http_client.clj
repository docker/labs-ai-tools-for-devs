(ns http-client
  (:require
   [babashka.curl :as curl]
   [cheshire.core :as json]
   [clojure.java.io :as io]) 
  (:import
   [java.io BufferedInputStream]))

(def connect-response
  (curl/get "https://gitmcp.io/docker/labs-ai-tools-for-devs/sse"
            {:headers {"Accept" "text/event-stream"
                       "Connection" "keep-alive"}
             :as :stream}))

(defn event-reader [response name]
  (.start
    (Thread.
      (fn []
        (let [rdr (io/reader (BufferedInputStream. (:body response)))]
          (loop []
            (let [line (.readLine rdr)]
              (when line
                (println (format "%s: %s" name line))
                (recur))))
          (println (format "%s: %s" name "done reading stream")))))))

(event-reader connect-response "connect")

(defn initialize [url]
  (curl/post (format "https://gitmcp.io/slimslenderslacks/hani%s" url)
             {:headers {"Accept" "text/event-stream"
                        "Content-Type" "application/json"
                        "Connection" "keep-alive"}
              :throw false
              :body (json/generate-string {:jsonrpc "2.0"
                                           :method "initialize"
                                           :id 0
                                           :params {:protocolVersion "2024-11-05"
                                                    :capabilities {}
                                                    :clientInfo {:name "SSE Client" :version "0.1"}}}) }))

;; must be 202 Accepted
(def initialize-response (initialize "/*/message?sessionId=b55383c621227380ce7e6182347c49cf1b12270501cc29fb9745b72732b32907"))

(defn tool-list [url]
  (curl/post (format "https://gitmcp.io/slimslenderslacks/hani%s" url)
             {:headers {"Accept" "text/event-stream"
                        "Content-Type" "application/json"
                        "Connection" "keep-alive"}
              :throw false
              :body (json/generate-string {:jsonrpc "2.0"
                                           :method "tools/list"
                                           :id 1
                                           :params {}}) }))

(def tool-list-response (tool-list "/*/message?sessionId=b55383c621227380ce7e6182347c49cf1b12270501cc29fb9745b72732b32907"))
(.close (:body connect-response))


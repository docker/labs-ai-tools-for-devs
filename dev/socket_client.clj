(ns socket-client
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]) 
  (:import
   [java.io BufferedInputStream]
   [java.net Socket]))

(def socket (Socket. "localhost" 8811))

(def reader (io/reader (BufferedInputStream. (.getInputStream socket))))

(async/thread
  (loop []
    (let [line (.readLine reader)]
      (when line
        (println line)
        (recur)))))

(def writer (io/writer (.getOutputStream socket)))

(defn send [m]
  (.write writer (json/generate-string m))
  (.write writer "\n")
  (.flush writer))

(send {:jsonrpc "2.0" :method "initialize" :id 0 :params {:protocolVersion "2024-11-05"
                                                          :capabilities {:roots {}} 
                                                          :client-info {:name "Socket Client" :version "0.1"}}})

(send {:jsonrpc "2.0" :method "notifications/initialized" :params {}})

(send {:jsonrpc "2.0" :id 1 :result {:roots [{:uri "file:///Users/slim" :name "home-directory"}]}})

(.close socket)


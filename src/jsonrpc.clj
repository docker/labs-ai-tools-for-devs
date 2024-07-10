(ns jsonrpc 
  (:require
   [cheshire.core :as json]
   [clojure.java.io :as io])
  (:import
   [java.io OutputStream]))

(def ^:private write-lock (Object.))

(defn ^:private write-message [^OutputStream output msg]
  (let [content (json/generate-string msg)
        content-bytes (.getBytes content "utf-8")]
    (locking write-lock
      (doto output
        (.write (-> (str "Content-Length: " (count content-bytes) "\r\n"
                         "\r\n")
                    (.getBytes "US-ASCII"))) ;; headers are in ASCII, not UTF-8
        (.write content-bytes)
        (.flush)))))

(defn notification [method params]
  {:jsonrpc "2.0"
   :method method
   :params params})

(defn -notify [method params]
  (case method
    :message (write-message (io/output-stream System/out) (notification method params))
    :functions (write-message (io/output-stream System/out) (notification method params))
    :functions-done (write-message (io/output-stream System/out) (notification method params))))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defn -println [method params]
  (case method
    :message (do (print (:content params)) (flush))
    :functions (do (print ".") (flush))
    :functions-done (println params)))

(def ^:dynamic notify -notify)

(comment
  (notify :message {:content "message"}))

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

;; message({:debug ""}) - debug messages are often serialized edn but still meant to be streamed
;; message({:content ""}) - meant to be streamed
;; prompts({:messages [{:role "", :content ""}]})
;; functions("") - meant to be updated in place
;; functions-done("")
(defn -notify [{:keys [debug]} method params]
  (case method
    :message (write-message (io/output-stream System/out) (notification method params))
    :prompts (write-message (io/output-stream System/out) (notification method params))
    :functions (write-message (io/output-stream System/out) (notification method params))
    :functions-done (write-message (io/output-stream System/out) (notification method params))))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defn -println [{:keys [debug]} method params]
  (case method
    :message (cond 
               (:content params) (do (print (:content params)) (flush))
               (and debug (:debug params)) (do (println "### DEBUG\n") (println (:debug params))))
    :functions (do (print ".") (flush))
    :functions-done (println params)
    :prompts nil))

(def ^:dynamic notify -notify)

(comment
  (notify :message {:content "message"}))

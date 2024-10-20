(ns user-loop
  (:require
   [clojure.core.async :as async]
   graph
   jsonrpc)
  (:import
   [java.io
    BufferedOutputStream
    OutputStream
    PipedInputStream
    PipedOutputStream]))

(declare graph)

(def do-stream (partial graph/stream graph))

(defn start-jsonrpc-loop [f in m]
  (let [c (jsonrpc/input-stream->input-chan in {})]
    (async/go-loop
     [state m]
      (let [message (async/<! c)
            s (-> message :params :content)]
        (println "message content: " s)
        (if (some (partial = s) ["exit" "quit" "q"])
          state
          (recur (async/<! (f state s))))))))

(def counter (atom 0))
(defn get-id [] (swap! counter inc))

(def ^{:private true} start-test-loop
  (partial start-jsonrpc-loop (fn [state s]
                                (async/go
                                  (update state :messages (fnil conj []) s)))))

(defn -create-pipe []
  ;; Create a PipedInputStream and PipedOutputStream
  (let [piped-out (PipedOutputStream.)
        piped-in  (PipedInputStream. piped-out)
        buffered-out (BufferedOutputStream. piped-out)]
    [[(fn [s] (jsonrpc/write-message buffered-out s))
      (fn [] (.close ^OutputStream buffered-out))]
     piped-in]))

(comment
  (let [[[w c] in] (-create-pipe)]
    (async/go (println "ending: " (async/<! (start-test-loop in {}))))
    (w (jsonrpc/request "prompt" {:content "hello"} get-id))
    (w (jsonrpc/request "prompt" {:content "hello1"} get-id))
    (w (jsonrpc/request "prompt" {:content "exit"} get-id))
    (c)))

(comment
  ;; an input stream is something from which we can read bytes
  ;; in a jvm, we can create Strings from bytes
  ;; a byte is 8 bits in java and big-endian by default
  ;; 8 bits can be stored using two hex digits (0-9, a-f) 00-ff (0-255) 1111 8+4+2+1=15
  )


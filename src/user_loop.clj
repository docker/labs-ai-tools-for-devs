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

(defn state-reducer [state s]
  (update state :messages (fnil conj []) {:role "user" :content s}))

(defn create-test-step []
  (fn [state]
    (async/go
      state)))

(defn start-jsonrpc-loop
  "start a jsonrpc loop that will inject jsonrpc requests into an
   ongoing set of state transitions
   params
     run-graph    async state -> state
     reduce-state state, message -> state
     in           input stream
     m   initial  state
   returns
     the final state"
  [run-step state-reducer in m]
  (let [input-channel (jsonrpc/input-stream->input-chan in {})]
    (async/go-loop
     [next-state (async/<! (run-step m)) n 0]
      (let [message (async/<! input-channel)]
        (cond
          (= "exit" (:method message))
          (assoc next-state :jsonrpc-loop-finished :exit)
          :else
          (recur (async/<! ((comp run-step state-reducer) next-state (-> message :params :content))) (inc n)))))))

(def counter (atom 0))
(defn get-id [] (swap! counter inc))

(def ^{:private true} start-test-loop
  (partial start-jsonrpc-loop (create-test-step) state-reducer))

(defn create-pipe 
  "returns [[write close] in]"
  []
  ;; Create a PipedInputStream and PipedOutputStream
  (let [piped-out (PipedOutputStream.)
        piped-in  (PipedInputStream. piped-out)
        buffered-out (BufferedOutputStream. piped-out)]
    [[(fn [s] (jsonrpc/write-message buffered-out s))
      (fn [] (.close ^OutputStream buffered-out))]
     piped-in]))

(comment
  (println "should be true: "
    (async/<!!
      (let [[[w c] in] (create-pipe)]
        (w (jsonrpc/request "prompt" {:content "hello"} get-id))
        (w (jsonrpc/request "prompt" {:content "hello1"} get-id))
        (w (jsonrpc/request "prompt" {:content "hello2"} get-id))
        (w (jsonrpc/request "exit" {} get-id))
        (c)
        (async/go 
          (println "ending: " (async/<! (start-test-loop in {})))
          true)))))

(comment
  ;; an input stream is something from which we can read bytes
  ;; in a jvm, we can create Strings from bytes
  ;; a byte is 8 bits in java and big-endian by default
  ;; 8 bits can be stored using two hex digits (0-9, a-f) 00-ff (0-255) 1111 8+4+2+1=15
  )


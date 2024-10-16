(ns graph
  (:require
   [babashka.fs :as fs]
   [clojure.core.async :as async]
   [clojure.pprint :refer [pprint]]
   git
   jsonrpc
   openai
   prompts
   state
   tools)
  (:import
   [java.net ConnectException]))

(defn- stop-looping [c s]
  (jsonrpc/notify :error {:content s})
  (async/>!! c {:messages [{:role "assistant" :content s}]
                :finish-reason "error"}))

(defn run-llm
  "call openai compatible chat completion endpoint and handle tool requests
    params
      messages   is the conversation history
      metadata   from the initial prompt
      functions  definition for functions referenced in the initial prompt
      opts       for running the model
    returns channel that will contain an coll of messages"
  [messages m functions {:keys [url model stream level] :as _opts :or {level 0}}]
  (let [[c h] (openai/chunk-handler)
        request (merge
                 m
                 {:messages messages
                  :level level}
                 (when (seq functions) {:tools functions})
                 (when url {:url url})
                 (when model {:model model})
                 (when (and stream (nil? (:stream m))) {:stream stream}))]
    (try
      (if (seq messages)
        (openai/openai request h)
        (stop-looping c "This is an empty set of prompts.  Define prompts using h1 sections (eg `# prompt user`)"))
      (catch ConnectException _
        (stop-looping c "I cannot connect to an openai compatible endpoint."))
      (catch Throwable t
        (stop-looping c (str t))))
    c))

; =====================================================
; Node functions take state and return data that should 
; be merged into the conversation state
; =====================================================

(defn start [{:keys [prompts] :as opts} _]
  (let [c (async/promise-chan)]
    (try
      (let [new-prompts (prompts/get-prompts opts)]
        (jsonrpc/notify :prompts {:messages new-prompts})
        (async/put! c {:metadata (prompts/collect-metadata prompts)
                       :functions (prompts/collect-functions prompts)
                       :opts opts
                       :messages new-prompts}))
      (catch Throwable ex
        (jsonrpc/notify :error {:content
                                (format "failure for prompt configuration:\n %s" (with-out-str (pprint (dissoc opts :pat :jwt))))
                                :exception (str ex)})
        (async/put! c {:messages [] :done "error"})))
    c))

(defn end [state]
  (let [c (async/promise-chan)]
    ;; this is a normal ending and we try to add a :done key to the state for this
    (async/put! c (assoc state :done (:finish-reason state)))
    c))

(defn completion [state]
  (run-llm (:messages state) (:metadata state) (:functions state) (:opts state)))

(defn tool [state]
  (let [calls (-> (:messages state) last :tool_calls)]
    (jsonrpc/notify :message {:debug (with-out-str (pprint calls))})
    (async/go
      ;; tool-calls 
      {:messages
       (into []
             (async/<!
              (->> (tools/make-tool-calls
                    (-> state :opts :level)
                    (partial tools/function-handler (assoc (:opts state) :functions (:functions state)))
                    calls)
                   (async/reduce conj []))))})))

(declare stream chat-with-tools)

; tool_calls are maps with an id and a function with arguments an name
; look up the full tool definition using the name
(defn sub-graph [state]
  (async/go
    (let [definition (state/get-function-definition state)
          arg-context (let [raw-args (-> state :messages last :tool_calls first :function :arguments)]
                        (tools/arg-context raw-args))
          sub-graph-state
          (async/<!
           (stream
            (chat-with-tools
             (-> (:opts state)
                 (assoc :level (inc (or (-> state :opts :level) 0))
                        :prompts (git/prompt-file (:ref definition))
                        :parameters arg-context)))))]
      {:messages (-> sub-graph-state :messages last)})))

; =====================================================
; edge functions takes state and returns next node
; =====================================================

(defn tool-or-end [state]
  (let [finish-reason (-> state :finish-reason)]
    (cond
      (and
       (= "tool_calls" finish-reason)
       (state/prompt-tool? state)) "sub-graph"
      (= "tool_calls" finish-reason) "tool"
      :else "end")))

; =====================================================
; Construct and run graphs
; =====================================================

(defn add-node [graph s f]
  (assoc-in graph [:nodes s] f))
(defn add-edge [graph s1 s2]
  (assoc-in graph [:edges s1] (constantly s2)))
(defn add-conditional-edges [graph s1 f & [m]]
  (assoc-in graph [:edges s1] ((or m identity) f)))

(defn stream
  "start streaming a conversation"
  [graph]
  (async/go-loop
   [state {}
    node "start"]
    (jsonrpc/notify :message {:debug (format "-> entering %s\n%s" node (with-out-str (pprint (state/summarize state))))})
    (let [enter-node (get-in graph [:nodes node])]
      (if (= "end" node)
        (async/<! (enter-node state))
        (let [s (async/<! (enter-node state))
              new-state (-> state
                            (merge (dissoc s :messages))
                            (update :messages concat (:messages s)))]
          ;; transition to the next state
          (recur new-state ((get-in graph [:edges node]) new-state)))))))

; ============================================================
; this is the graph we tend to use in our experiments thus far
; ============================================================

(defn chat-with-tools [opts]
  (-> {}
      (add-node "start" (partial start opts))
      (add-node "completion" completion)
      (add-node "tool" tool)
      (add-node "end" end)
      (add-node "sub-graph" sub-graph)
      (add-edge "start" "completion")
      (add-edge "tool" "completion")
      (add-conditional-edges "completion" tool-or-end)))

(comment
  (alter-var-root #'jsonrpc/notify (fn [_] (partial jsonrpc/-println {:debug true})))
  (let [x {:prompts (fs/file "/Users/slim/docker/labs-ai-tools-for-devs/prompts/curl/README.md")
           :platform "darwin"
           :user "jimclark106"
           :thread-id "thread"
           :host-dir "/Users/slim"
           :stream true}]
    (state/summarize (async/<!! (stream (chat-with-tools x))))))

(comment
  (def x {:stream true,
          :host-dir "/Users/slim/docker/labs-make-runbook",
          :prompts "/Users/slim/docker/labs-ai-tools-for-devs/prompts/hub/default.md"
          :platform "darwin", :user "jimclark106",
          :thread-id "3e61ffe7-840e-4177-b84a-f6f7db58b24d"})
  (state/summarize
   (async/<!! (stream (chat-with-tools x)))))


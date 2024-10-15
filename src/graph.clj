(ns graph
  (:require
   [clojure.core.async :as async]
   [clojure.pprint :refer [pprint]]
   jsonrpc
   openai
   prompts
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
      messages is the conversation history
      opts for running the model, including tools
    returns channel that will contain an coll of messages"
  [messages m functions {:keys [url model stream level] :as _opts :or {level 0}}]
  (let [[c h] (openai/chunk-handler)]
    (try
      (if (seq messages)
        (openai/openai
         (merge
          m
          {:messages messages
           :level level}
          (when (seq functions) {:tools functions})
          (when url {:url url})
          (when model {:model model})
          (when (and stream (nil? (:stream m))) {:stream stream})) h)
        (stop-looping c "This is an empty set of prompts.  Define prompts using h1 sections (eg `# prompt user`)"))
      (catch ConnectException _
        (stop-looping c "I cannot connect to an openai compatible endpoint."))
      (catch Throwable t
        (stop-looping c (str t))))
    c))

(defn conversation-loop
  "thread loop for an openai compatible endpoint
     returns messages and done indicator"
  [{:keys [level prompts] :or {level 0} :as opts}]
  (try
    (let [m (prompts/collect-metadata prompts)
          functions (prompts/collect-functions prompts)
          new-prompts (prompts/get-prompts opts)]
      (jsonrpc/notify :prompts {:messages new-prompts})
      (async/go-loop [thread []]
                     ;; get-prompts can only use extractors - we can't refine
                     ;; them based on output from function calls that the LLM plans
        (let [prompts (if (not (seq thread))
                        new-prompts
                        thread)
              {:keys [messages finish-reason] :as m} (async/<! (run-llm prompts m functions opts))]
          (if (= "tool_calls" finish-reason)
            (do
              (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
              (recur
               (let [x
                     (async/<! (->> (tools/make-tool-calls
                                     level
                                     (partial tools/function-handler (assoc opts :functions functions))
                                     (-> messages first :tool_calls))
                                    (async/reduce conj (into [] (concat
                                                                  prompts messages)))))]
                 x)))
            (do
              (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
              {:messages (concat prompts messages) :done finish-reason})))))
    (catch Throwable ex
      (let [c (async/promise-chan)]
        (jsonrpc/notify :error {:content
                                (format "failure for prompt configuration:\n %s" (with-out-str (pprint (dissoc opts :pat :jwt))))
                                :exception (str ex)})
        (async/>! c {:messages [] :done "error"})
        c))))

(comment
  (def x {:stream true,
          :host-dir "/Users/slim/docker/labs-make-runbook",
          :prompts "/Users/slim/docker/labs-ai-tools-for-devs/prompts/hub/default.md"
          :platform "darwin", :user "jimclark106",
          :thread-id "3e61ffe7-840e-4177-b84a-f6f7db58b24d"})
  (async/<!! (conversation-loop
              x)))

(comment
  ;; for testing conversation-loop in repl
  (def x {:stream true,
          :host-dir "/Users/slim/docker/labs-make-runbook",
          :prompts "/Users/slim/docker/labs-ai-tools-for-devs/prompts/hub/default.md"
          :platform "darwin", :user "jimclark106",
          :thread-id "3e61ffe7-840e-4177-b84a-f6f7db58b24d"})
  (prompts/get-prompts x)
  (prompts/run-extractors x)
  (prompts/collect-extractors (:prompts x)))

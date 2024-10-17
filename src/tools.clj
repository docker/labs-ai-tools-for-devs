(ns tools
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   docker
   git
   jsonrpc
   [selmer.parser :as selmer]))

(set! *warn-on-reflection* true)

(defn interpolate [m template]
  (selmer/render template m {}))

(defn arg-context [json-arg-string]
  (merge
   ;; TODO raw is a bad name when merging
   {:raw (if json-arg-string
           json-arg-string
           "{}")}
   (when json-arg-string (json/parse-string json-arg-string true))))

(defn function-handler
  "make openai tool call
   supports container tool definitions and prompt tool definitions 
   (prompt tools can have their own child tools definitions)
   does not stream - calls resolve or fail only once 
   should not throw exceptions
     params
       opts - options map for the engine
       function-name - the name of the function that the LLM has selected
       json-arg-string - the JSON arg string that the LLM has generated
       resolve fail - callbacks"
  [{:keys [functions user jwt timeout level] :as opts :or {level 0}} function-name json-arg-string {:keys [resolve fail]}]
  (if-let [definition (->
                       (->> (filter #(= function-name (-> % :function :name)) functions)
                            first)
                       :function)]
    (let [arg-context (arg-context json-arg-string)]
      (try
        (if (:container definition) ;; synchronous call to container function
          (let [function-call (merge
                               (:container definition)
                               (dissoc opts :functions)
                               {:command (into []
                                               (concat
                                                []
                                                (->>
                                                 (-> definition :container :command)
                                                 (map (partial interpolate arg-context))
                                                 (into []))))}
                               (when user {:user user})
                               (when jwt {:jwt jwt})
                               (when timeout {:timeout timeout}))
                {:keys [pty-output exit-code done] :as result} (docker/run-container function-call)
                exit-code-fail? (if (false? (:check-exit-code definition))
                                  false
                                  (not= 0 exit-code))]
            (cond
              (and (= :exited done) (not exit-code-fail?))
              (resolve pty-output)
              (and (= :exited done) exit-code-fail?)
              (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))
              (= :timeout done)
              (fail (format "call timed out: %s" (:timeout result)))
              :else
              (fail (format "call failed"))))

          (fail (format "bad container definition %s" definition)))
        (catch Throwable t
          (fail (format "system failure %s" t)))))
    (fail "no function found")))

(defn call-function
  "  returns channel that will emit one message and then close"
  [level function-handler function-name arguments tool-call-id]
  (let [c (async/chan)]
    (try
      (function-handler
       function-name
       arguments
       {:resolve
        (fn [output]
          (jsonrpc/notify :start {:level level :role "tool" :content function-name})
          (jsonrpc/notify :message {:content (format "\n%s\n" output)})
          (async/go
            (async/>! c {:content output :role "tool" :tool_call_id tool-call-id})
            (async/close! c)))
        :fail
        (fn [output]
          (jsonrpc/notify :start {:level level :role "tool" :content function-name})
          (jsonrpc/notify :message {:content (format "function call failed %s" output)})
          (async/go
            (async/>! c {:content output :role "tool" :tool_call_id tool-call-id})
            (async/close! c)))})
      (catch Throwable t
        ;; function-handlers should handle this on their own but this is just in case
        (async/go
          (async/>! c {:content (format "unable to run %s - %s" function-name t) :role "tool" :tool_call_id tool-call-id})
          (async/close! c))))
    c))

(defn make-tool-calls
  " returns channel with all messages from completed executions of tools"
  [level function-handler tool-calls]
  (->>
   (for [{{:keys [arguments name]} :function tool-call-id :id} tool-calls]
     (call-function level function-handler name arguments tool-call-id))
   (async/merge)))


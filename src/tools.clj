(ns tools
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.pprint :as pp]
   docker
   git
   interpolate
   jsonrpc
   [jsonrpc.logger :as logger]
   [mcp.client :as client]
   trace))

(set! *warn-on-reflection* true)

(defn function-handler
  "make tool call
   supports container tool definitions and prompt tool definitions 
   (prompt tools can have their own child tools definitions)
   does not stream - calls resolve or fail only once 
   should not throw exceptions
     params
       defaults - valid elements of a container definition (functions dissoced)
       function-name - the name of the function that the LLM has selected
       json-arg-string - the JSON arg string that the LLM has generated
       resolve fail - callbacks"
  [{:keys [functions] :as defaults} function-name json-arg-string {:keys [resolve fail respond]}]
  (if-let [definition (->
                       (filter #(= function-name (-> % :function :name)) functions)
                       first
                       :function)]
    (try
      (if (:container definition) ;; synchronous call to container function
        (let [function-call (interpolate/container-definition definition defaults json-arg-string)]
          (let [s (format "function call %s"
                          (with-out-str
                            (pp/pprint (-> function-call
                                           (update :jwt (fn [s] (if s "xxxxxxx" "not-set")))))))]
            (jsonrpc/notify
             :message
             {:debug s})
            (logger/debug s))
          (trace/container-call (update function-call :jwt (fn [s] (if s "xxxxxxx" "not-set"))))
          ;; run container
          ;;   pure containers produce pty-output, exit-code, and done
          ;;   mcp containers produce pty-output, exit-code, done, and a jsonrpc response id and result
          (let [{:keys [pty-output exit-code done result error] :as response}
                (if (= :mcp (:type function-call))
                  ;; start mcp container
                  (async/<!!
                   (client/call-tool
                    function-call
                    {:name function-name
                     :arguments (json/parse-string json-arg-string keyword)}))
                  ;; start pure container
                  (docker/run-container function-call))
                exit-code-fail? (if (false? (:check-exit-code definition))
                                  false
                                  (not= 0 exit-code))]
            (cond
              ;; mcp servers have result or errors
              (or result error)
              (respond response)
              ;; mcp servers might also have errors
              (= :running done)
              (resolve pty-output)
              ;; for exited containers that are always successful and we have some pty output
              (and (= :exited done) (not exit-code-fail?) pty-output (not (= "" pty-output)))
              (resolve pty-output)
              ;; for exited containers that are always successful and we nave no pty output
              (and (= :exited done) (not exit-code-fail?))
              (resolve "success")
              ;; hmmmm
              (= :running done)
              (resolve "success")
              ;; for containers where we trust the exit code and it has failed
              (and (= :exited done) exit-code-fail?)
              (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))
              ;; timeouts
              (= :timeout done)
              (fail (format "call timed out: %s" (:timeout response)))
              ;; catch all
              :else
              (fail (format "call failed")))))

        (fail (format "bad container definition %s" definition)))
      (catch Throwable t
        (fail (format "system failure %s" t))
        (fail (with-out-str (.printStackTrace t)))))
    (fail "no function found")))

(defn call-function
  "  returns a promise channel that will emit one message and then close"
  [level function-handler function-name arguments tool-call-id]
  (let [c (async/chan)]
    (try
      (function-handler
       function-name
       arguments
       {:respond
        ;; just forward the tool call response
        (fn [response]
          (jsonrpc/notify :start {:level level :role "tool" :content function-name})
          (jsonrpc/notify :message {:content (format "\n%s\n" response)})
          (async/go
            (async/>! c response)
            (async/close! c)))
        :resolve
        ;; regular containers resolving successfully
        (fn [output]
          (jsonrpc/notify :start {:level level :role "tool" :content function-name})
          (jsonrpc/notify :message {:content (format "\n%s\n" output)})
          (async/go
            (async/>! c {:content output :role "tool" :tool_call_id tool-call-id})
            (async/close! c)))
        :fail
        ;; regular containers failing
        (fn [output]
          (jsonrpc/notify :start {:level level :role "tool" :content function-name})
          (jsonrpc/notify :message {:content (format "function call failed %s" output)})
          (async/go
            (async/>! c {:content output :role "tool" :tool_call_id tool-call-id})
            (async/close! c)))})
      (catch Throwable t
        ;; function-handlers should handle this on their own but this is just in case
        (logger/error t)
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


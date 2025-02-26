(ns tools
  (:require
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [clojure.pprint :as pp]
   docker
   git
   jsonrpc
   [jsonrpc.logger :as logger]
   [selmer.filters :as filters]
   [selmer.parser :as selmer]
   trace))

(set! *warn-on-reflection* true)

(filters/add-filter! :into (fn [v]
                             (if (coll? v)
                               [:safe [:coll (into [] v)]]
                               v)))

(defn interpolate [m template]
  (when-let [s (selmer/render template m {})]
    (if-let [parsed (try (edn/read-string s) (catch Throwable _ nil))]
      (if (and (coll? parsed) (= :coll (first parsed)))
        (second parsed)
        [s])
      [s])))

(defn interpolate-coll [command-args arg-context]
  (->>
   command-args
   (mapcat (partial interpolate arg-context))
   (into [])))

(defn arg-context [json-arg-string]
  (merge
   {:raw (if json-arg-string
           json-arg-string
           "{}")}
   (when json-arg-string (json/parse-string json-arg-string true))))

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
  [{:keys [functions] :as defaults} function-name json-arg-string {:keys [resolve fail]}]
  (if-let [definition (->
                       (->> (filter #(= function-name (-> % :function :name)) functions)
                            first)
                       :function)]
    (let [arg-context (merge
                       {:hostDir (:host-dir defaults)}
                       (arg-context json-arg-string))]
      (try
        (if (:container definition) ;; synchronous call to container function
          (let [function-call (cond-> (merge
                                       (:container definition)
                                       (dissoc defaults :functions)
                                       {:command (interpolate-coll
                                                  (-> definition :container :command)
                                                  arg-context)}
                                       (when (-> definition :container :mounts)
                                         {:mounts (->> (-> definition :container :mounts)
                                                       (map (fn [s] (first (interpolate arg-context s))))
                                                       (into []))})
                                       (when (-> definition :container :volumes)
                                         {:volumes (->> (-> definition :container :volumes)
                                                        (map (fn [s] (first (interpolate arg-context s))))
                                                        (into []))})
                                          ;; workdirs in a container definition will always override ones
                                          ;; set in the metadata
                                       (when-let [wd (or
                                                      (-> definition :container :workdir)
                                                      (:workdir defaults))]
                                         {:workdir (first (interpolate arg-context wd))}))

                                (-> definition :container :stdin :file) (update-in [:stdin :file] (fn [s] (first (interpolate arg-context s))))

                                (-> definition :container :stdin :content) (update-in [:stdin :content] (fn [s] (first (interpolate arg-context s)))))]
            (let [s (format "function call %s"
                            (with-out-str
                              (pp/pprint (-> function-call
                                             (update :jwt (fn [s] (if s "xxxxxxx" "not-set")))))))]
              (jsonrpc/notify
               :message
               {:debug s})
              (logger/debug s))
            (trace/container-call (update function-call :jwt (fn [s] (if s "xxxxxxx" "not-set"))))
            (let [{:keys [pty-output exit-code done] :as result} (docker/run-container function-call)
                  exit-code-fail? (if (false? (:check-exit-code definition))
                                    false
                                    (not= 0 exit-code))]
              (cond
                (= :running done)
                (resolve pty-output)
                (and (= :exited done) (not exit-code-fail?) pty-output (not (= "" pty-output)))
                (resolve pty-output)
                (and (= :exited done) (not exit-code-fail?))
                (resolve "success")
                (= :running done)
                (resolve "success")
                (and (= :exited done) exit-code-fail?)
                (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))
                (= :timeout done)
                (fail (format "call timed out: %s" (:timeout result)))
                :else
                (fail (format "call failed")))))

          (fail (format "bad container definition %s" definition)))
        (catch Throwable t
          (fail (format "system failure %s" t))
          (fail (with-out-str (.printStackTrace t))))))
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


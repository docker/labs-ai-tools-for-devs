(ns openai
  (:require
   [babashka.http-client :as http]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.spec.alpha :as s]
   [clojure.string :as string]
   [jsonrpc]))

(defn openai-api-key []
  (try
    (string/trim (slurp (io/file (System/getenv "HOME") ".openai-api-key")))
    (catch Throwable _ nil)))

(defn openai
  "get a response
   response stream handled by callback
     returns nil
     throws exception if response can't be initiated or if we get a non 200 status code"
  [request cb]
  (jsonrpc/notify :message {:content "\n## ROLE assistant\n"})
  (let [b (merge
           {:model "gpt-4"
            :stream true}
           (dissoc request :url))
        response
        (http/post
         (or (:url request) "https://api.openai.com/v1/chat/completions")
         (merge
          {:body (json/encode b)
           :headers {"Authorization" (format "Bearer %s" (or
                                                          (openai-api-key)
                                                          (System/getenv "OPENAI_API_KEY")))
                     "Content-Type" "application/json"}
           :throw false}
          (when (true? (:stream b))
            {:as :stream})))]
    (if (= 200 (:status response))
      (if (not (true? (:stream b)))
        (cb (slurp (:body response)))
        (doseq [chunk (line-seq (io/reader (:body response)))]
          (cb chunk)))
      (throw (ex-info "Failed to call OpenAI API" {:body (slurp (:body response))})))))

(defn call-function 
  "  returns channel that will emit one message and then close"
  [function-handler function-name arguments tool-call-id]
  (let [c (async/chan)]
    (try
      (function-handler
        function-name
        arguments
        {:resolve
         (fn [output]
           (jsonrpc/notify :message {:content (format "\n## ROLE tool (%s)\n%s\n" function-name output)})
           (async/go
             (async/>! c {:content output :role "tool" :tool_call_id tool-call-id})
             (async/close! c)))
         :fail (fn [output]
                 (jsonrpc/notify :message {:content (format "\n## ROLE tool\n function call %s failed %s" function-name output)})
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
  [function-handler tool-calls]
  (->>
   (for [{{:keys [arguments name]} :function tool-call-id :id} tool-calls]
     (call-function function-handler name arguments tool-call-id))
   (async/merge)))

(defn function-merge [m {:keys [name arguments]}]
  (cond-> m
    name (assoc :name name)
    arguments (update :arguments str arguments)))

(defn update-tool-calls [m tool-calls]
  (reduce
   (fn [m {:keys [index id function]}]
     (-> m
         (update-in [:tool-calls (or index id) :function]
                    (fnil function-merge {}) function)
         (update-in [:tool-calls (or index id)]
                    (fnil merge {}) (when id {:id id}))))
   m tool-calls))

(def finish-reasons
  {:stop "stopped normally"
   :length "max response length reached"
   :tool_calls "making tool calls"
   :content_filter "content filter applied"
   :not_specified "not specified"})

(s/def ::role #{"user" "system" "assistant" "tool"})
(s/def ::content string?)
(s/def ::message (s/keys :req-un [::role ::content]))
(s/def ::messages (s/coll-of ::message))
(s/def ::finish-reason any?)
(s/def ::response (s/keys :req-un [::finish-reason ::messages]))
(defn response-loop
  "handle one response stream that we read from input channel c
   adds content or tool_calls while streaming and call any functions when done
     returns channel that will emit the an event with a ::response"
  [c]
  (let [response (atom {})]
    (async/go-loop
     []
      (let [e (async/<! c)]
        (cond
          (:done e) (let [{calls :tool-calls content :content finish-reason :finish-reason} @response
                          messages [(merge
                                     {:role "assistant"}
                                     (when (seq (vals calls))
                                       {:tool_calls (->> (vals calls)
                                                         (map #(assoc % :type "function")))})
                                     (when content {:content content}))]]
                      (jsonrpc/notify :functions-done (vals calls))
                      ;; make-tool-calls returns a channel with results of tool call messages
                      ;; so we can continue the conversation
                      {:finish-reason finish-reason
                       :messages
                       (async/<!
                        (->>
                         (make-tool-calls
                          (:tool-handler e)
                          (vals calls))
                         (async/reduce conj messages)))})
          (:content e) (do
                         (swap! response update-in [:content] (fnil str "") (:content e))
                         (jsonrpc/notify :message {:content (:content e)})
                         (recur))
          :else (let [{:keys [tool_calls finish-reason]} e]
                  (swap! response update-tool-calls tool_calls)
                  (when finish-reason (swap! response assoc :finish-reason finish-reason))
                  (jsonrpc/notify :functions (->> @response :tool-calls vals))
                  (recur)))))))

(defn parse [s]
  (if (= "[DONE]" (string/trim s))
    {:done true}
    (json/parse-string s true)))

(defn chunk-handler
  "sets up a response handler loop for use with an OpenAI API call
    returns [channel openai-handler] - channel will emit the updated chat messages after dispatching any functions"
  [function-handler]
  (let [c (async/chan 1)]
    [(response-loop c)
     (fn [chunk]
       ;; TODO this only supports when there's a single choice
       (let [{[{:keys [delta message finish_reason _role]}] :choices
              done? :done
              _completion-id :id}
             ;; only streaming events will be SSE data fields
             (some-> chunk
                     (string/replace #"data: " "")
                     (parse))]
         (try
           (cond
             ;; TODO validate this works for non-streaming cases
             done? (async/>!!
                    c
                    (merge
                     {:done true :tool-handler function-handler}
                     (when finish_reason {:finish-reason finish_reason})))

             ;; there are deltas when this is streaming
             delta (cond
                     (:content delta) (async/>!! c (merge
                                                    {:content (:content delta)}
                                                    (when finish_reason {:finish-reason finish_reason})))

                     (:tool_calls delta) (async/>!! c (merge
                                                       delta
                                                       (when finish_reason {:finish-reason finish_reason})))
                     finish_reason (async/>!! c {:finish-reason finish_reason}))

             ;; there are only messages when this isn't streaming
             message (cond
                       (:content message) (do (async/>!! c (merge
                                                             {:content (:content delta)}
                                                             (when finish_reason {:finish-reason finish_reason})))
                                              (async/>!! c {:done true :tool-handler function-handler}))
                       (:tool_calls message) (do
                                               (async/>!! c (merge
                                                             message
                                                             (when finish_reason {:finish-reason finish_reason})))
                                               (async/>!! c {:done true :tool-handler function-handler})))
             finish_reason (async/>!! c {:finish-reason finish_reason}))
           (catch Throwable _))))]))



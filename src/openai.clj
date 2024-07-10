(ns openai
  (:require
   [babashka.http-client :as http]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
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
     throws exception only if response can't be initiated"
  [request cb]
  (jsonrpc/notify :message {:content "\n## ROLE assistant\n"})
  (let [response
        (http/post
         "https://api.openai.com/v1/chat/completions"
         {:body (json/encode (merge
                              {:model "gpt-4"
                               :stream true}
                              request))
          :headers {"Authorization" (format "Bearer %s" (or
                                                         (openai-api-key)
                                                         (System/getenv "OPENAI_API_KEY")))
                    "Content-Type" "application/json"}
          :throw false
          :as :stream})]
    (if (= 200 (:status response))
      (if (false? (:stream request))
        (cb (slurp (:body response)))
        (doseq [chunk (line-seq (io/reader (:body response)))]
          (cb chunk)))
      (throw (ex-info "Failed to call OpenAI API" {:body (slurp (:body response))})))))

(defn call-function [function-handler function-name arguments tool-call-id]
  (let [c (async/chan)]
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

(comment
  (reduce
   (partial update-tool-calls "guid")
   {}
   [[{:id "fid" :function {:name "echo"}}]
    [{:id "fid" :function {:arguments "some"}}]
    [{:id "fid" :function {:arguments " stuff"}}]]))

(def finish-reasons
  {:stop "stopped normally"
   :length "max response length reached"
   :tool_calls "making tool calls"
   :content_filter "content filter applied"
   :not_specified "not specified"})

(defn response-loop
  "handle one response stream that we read from input channel c
     returns channel that will emit the an event with a finish-reason and a status"
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
    returns [channel handler] - channel will emit the updated chat messages after dispatching any functions"
  [function-handler]
  (let [c (async/chan 1)]
    [(response-loop c)
     (fn [chunk]
       ;; TODO this only supports when there's a single choice
       (let [{[{:keys [delta message finish_reason _role]}] :choices
              done? :done _completion-id :id}
             ;; only streaming events will be SSE data fields
             (some-> chunk
                     (string/replace #"data: " "")
                     (parse))]
         (try
           (cond
             done? (async/>!!
                    c
                    (merge
                     {:done true :tool-handler function-handler}
                     (when finish_reason {:finish-reason finish_reason})))
             delta (cond
                     (:content delta) (do
                                        (async/>!! c (merge
                                                      {:content (:content delta)}
                                                      (when finish_reason {:finish-reason finish_reason})))
                                        (jsonrpc/notify :message {:content (:content delta)}))
                     (:tool_calls delta) (async/>!! c (merge
                                                       delta
                                                       (when finish_reason {:finish-reason finish_reason})))
                     finish_reason (async/>!! c {:finish-reason finish_reason}))

             message (cond
                       (:content message) (jsonrpc/notify :message {:content (:content message)})
                       (:tool_calls message) (do
                                               (async/>!! c (merge
                                                             message
                                                             (when finish_reason {:finish-reason finish_reason})))
                                               (async/>!! {:done true :tool-handler function-handler})))
             finish_reason (async/>!! c {:finish-reason finish_reason}))
           (catch Throwable _))))]))

(comment
  (openai
   {:messages [{:content "What is the meaning of life?" :role "user"}]}
   (second (chunk-handler (fn [& args] (println args)))))
  (openai
   {:messages [{:content "use a function to echo back to me a 10 line poem" :role "user"}]
    :tools [{:type "function"
             :function {:name "echo"
                        :description "echo something back to me"
                        :parameters
                        {:type "object"
                         :properties
                         {:content {:type "string"
                                    :description "the content to echo back"}}}}}]}
   (second (chunk-handler (fn [& args]
                            (println "function-handler " args))))))

(ns openai
  (:require
   [babashka.http-client :as http]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.string :as string]
   [jsonrpc]))

(set! *warn-on-reflection* true)

(defn openai-api-key []
  (try
    (string/trim (slurp (io/file (or (System/getenv "OPENAI_API_KEY_LOCATION") (System/getenv "HOME")) ".openai-api-key")))
    (catch Throwable _
      (throw (ex-info "Unable to read openai api-key secret" {})))))

(defn openai
  "get a response
   response stream handled by callback
     returns nil
     throws exception if response can't be initiated or if we get a non 200 status code"
  [request cb]
  (jsonrpc/notify :start {:level (or (:level request) 0) :role "assistant"})
  (let [b (merge
           {:model "gpt-4"}
           (dissoc request :url :level))
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
        (cb (if (string? (:body response))
              (:body response)
              (slurp (:body response))))
        (doseq [chunk (line-seq (io/reader (:body response)))]
          (cb chunk)))
      (let [s (if (string? (:body response))
                (:body response)
                (slurp (:body response)))]
        (jsonrpc/notify :message {:content s})
        (throw (ex-info "Failed to call OpenAI API" {:body s}))))))

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

(defn response-loop
  "handle one response stream that we read from input channel c
   adds content or tool_calls while streaming and call any functions when done
     returns channel that will emit the an event with a ::response"
  [c]
  (let [response (atom {})]
    (async/go-loop
     []
      (let [e (async/<! c)]
        (if (:done e)
          (let [{calls :tool-calls content :content finish-reason :finish-reason} @response
                r {:messages [(merge
                               {:role "assistant"
                                :content (or content "")}
                               (when (seq (vals calls))
                                 {:tool_calls (->> (vals calls)
                                                   (map #(assoc % :type "function")))}))]
                   :finish-reason finish-reason}]

            (jsonrpc/notify :message {:debug (str @response)})
            (jsonrpc/notify :functions-done (or (vals calls) ""))
            ;; make-tool-calls returns a channel with results of tool call messages
            ;; so we can continue the conversation
            r)

          (let [{:keys [content tool_calls finish-reason]} e]
            (when content
              (swap! response update-in [:content] (fnil str "") content)
              (jsonrpc/notify :message {:content content}))
            (when tool_calls
              (swap! response update-tool-calls tool_calls)
              (jsonrpc/notify :functions (->> @response :tool-calls vals)))
            (when finish-reason (swap! response assoc :finish-reason finish-reason))

            (recur)))))))

(defn parse [s]
  (if (= "[DONE]" (string/trim s))
    {:done true}
    (json/parse-string s true)))

(defn chunk-handler
  "sets up a response handler loop for use with an OpenAI API call
    returns [channel openai-handler] - channel will emit the updated chat messages after dispatching any functions"
  []
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
         ;; messages will either have a delta, a message, or just a finish_reason,
         ;; depending on whether it's streaming.  Usually, the finish_reason doesn't
         ;; occur on it's own.
         (cond
           done? (async/>!!
                  c
                  (merge
                   {:done true}
                   (when finish_reason {:finish-reason finish_reason})))

             ;; streaming
           delta
           (async/>!! c (merge
                         delta
                         (when finish_reason {:finish-reason finish_reason})))

             ;; non-streaming
           message
           (do
             (async/>!! c (merge
                           message
                           (when finish_reason {:finish-reason finish_reason})))
             (async/>!! c {:done true}))
           finish_reason (async/>!! c {:finish-reason finish_reason}))))]))



(ns claude
  (:require
   [babashka.http-client :as http]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [jsonrpc]))

(set! *warn-on-reflection* true)

(defn claude-api-key []
  (try
    (string/trim (slurp (io/file (or (System/getenv "CLAUDE_API_KEY_LOCATION") (System/getenv "HOME")) ".claude-api-key")))
    (catch Throwable _
      (throw (ex-info "Unable to read claude api-key secret" {})))))

(defn parse-sse [s]
  (when (string/starts-with? s "data:")
    (string/replace s "data: " "")))

(defn prepare-system-messages [request]
  (let [system-message (->> request :messages (filter #(= "system" (:role %))) (map :content) (apply str))]
    (-> request
        (assoc :system system-message)
        (update-in [:messages] (fn [messages] (filter (complement #(= "system" (:role %))) messages))))))

(comment
  (prepare-system-messages {})
  (prepare-system-messages {:messages [{:role "system" :content "hello"}
                                       {:role "user" :content "world"}]}))

(defn map-to-claude [tools]
  (->> tools
       (map (fn [{:keys [function]}] (-> function
                                         (select-keys [:name :description])
                                         (assoc :input_schema (or (:parameters function) {:type "object" :properties {}}))
                                         (assoc-in [:input_schema :required] []))))))

;; tool messages in claude are user messages with a tool_use_id instead of a tool_call_id
(defn filter-tool-messages [messages]
  (->> messages
       (map (fn [{:keys [role] :as m}]
              (if (= role "tool")
                {:role "user" :content [{:type "tool_result" :content (:content m) :tool_use_id (:tool_call_id m)}]}
                m)))))

(defn map-tool-use-messages [messages]
  (->> messages
       (map (fn [{:keys [tool_calls] :as message}]
              (if tool_calls
                {:role (:role message)
                 :content (concat
                            (when (and (:content message) (not (= "" (:content message)))) [{:type "text" :text (:content message)}])
                            (->> tool_calls
                                 (map (fn [{:keys [id function]}]
                                        {:type "tool_use"
                                         :id id
                                         :name (:name function)
                                         :input (or (json/parse-string (:arguments function) true) {})}))))}
                message)))))

(comment
  (filter-tool-messages [{:role "tool" :content "hello" :tool_call_id "1234"}]))

; tool 
(defn sample
  "get a response
   response stream handled by callback
     returns nil
     throws exception if response can't be initiated or if we get a non 200 status code"
  [request cb]
  (jsonrpc/notify :start {:level (or (:level request) 0) :role "assistant"})
  (let [b (merge
           {:model "claude-3-5-sonnet-20241022"
            :max_tokens 8192}
           (when (seq (:tools request))
             {:tool_choice {:type "auto"
                            :disable_parallel_tool_use true}})
           (-> request
               (prepare-system-messages)
               (update-in [:messages] filter-tool-messages)
               (update-in [:messages] map-tool-use-messages)
               (update-in [:tools] map-to-claude)
               (dissoc :url :level)))

        response
        (http/post
         (or (:url request) "https://api.anthropic.com/v1/messages")
         (merge
          {:body (json/encode b)
           :headers {"x-api-key" (or (claude-api-key)
                                     (System/getenv "CLAUDE_API_KEY"))
                     "anthropic-version" "2023-06-01"
                     "Content-Type" "application/json"}
           :throw false}
          (when (true? (:stream b))
            {:as :stream})))]
    (if (= 200 (:status response))
      (if (not (true? (:stream b)))
        (some-> (if (string? (:body response))
                  (:body response)
                  (slurp (:body response)))
                (json/parse-string true)
                (cb))
        (doseq [chunk (line-seq (io/reader (:body response)))]
          (some-> chunk
                  (parse-sse)
                  (json/parse-string true)
                  (cb))))
      (let [s (if (string? (:body response))
                (:body response)
                (slurp (:body response)))]
        (jsonrpc/notify :message {:content s})
        (throw (ex-info "Failed to call Claude API" {:body s}))))))

(comment
  (sample {:messages [{:role "user" :content "hello"}]
           :stream true} println)
  (sample {:messages [{:role "user" :content "run the curl command for https://www.google.com"}]
           :tools [{:name "curl"
                    :description "run the curl command"
                    :input_schema {:type "object"
                                   :properties {:url {:type "string"}}}}]
           :stream true} println))

(def stop-reasons
  {:end_turn "stopped normally"
   :max_tokens "max response length reached"
   :stop_sequence "making tool calls"
   :tool_use "content filter applied"})

(defn update-tool-calls [m tool-calls]
  (reduce
   (fn [m {:keys [id name arguments]}]
     (if id
       (-> m
           (update-in [:tool-calls id :function] (constantly {:name name}))
           (assoc-in [:tool-calls id :id] id)
           (assoc :current-tool-call id))
       (update-in m [:tool-calls (:current-tool-call m) :function :arguments] (fnil str "") arguments)))
   m tool-calls))

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

(defn chunk-handler
  "sets up a response handler loop for use with an OpenAI API call
    returns [channel openai-handler] - channel will emit the complete fully streamed response"
  []
  (let [c (async/chan 1)]
    [(response-loop c)
     (fn [{:keys [delta type] :as chunk}]
       (cond
         (and
          (= "message_delta" type)
          (:stop_reason delta))
         (async/>!! c {:finish-reason (if (= "tool_use" (:stop_reason delta))
                                        "tool_calls"
                                        (:stop_reason delta))})

         (and
          (= "content_block_start" type)
          (= "text" (-> chunk :content_block :type)))
         (async/>!! c {:content (-> chunk :content_block :text)})

         (and
          (= "content_block_delta" type)
          (= "text_delta" (-> delta :type)))
         (async/>!! c {:content (-> delta :text)})

         (= "message_stop" type)
         (async/>!! c {:done true})

         (and
          (= "content_block_delta" type)
          (= "input_json_delta" (-> delta :type)))
         ;; partial_json
         (async/>!! c {:tool_calls [{:arguments (-> delta :partial_json)}]})

         (and
          (= "content_block_start" type)
          (= "tool_use" (-> chunk :content_block :type)))
         ; id, name and input
         (async/>!! c {:tool_calls [(:content_block chunk)]})))]))

(comment

  (let [[c h] (chunk-handler)]
    (sample {:messages [{:role "user" :content "hello"}]
             :stream true} h)
    (println "post-stream:\n" (-> (async/<!! c)
                                  (pprint)
                                  (with-out-str))))

  (let [[c h] (chunk-handler)]
    (sample {:messages [{:role "user" :content "run the curl command for https://www.google.com"}]
             :tools [{:name "curl"
                      :description "run the curl command"
                      :input_schema {:type "object"
                                     :properties {:url {:type "string"}}}}]
             :stream true}  h)
    (println "post-stream:\n" (-> (async/<!! c)
                                  (pprint)
                                  (with-out-str)))))

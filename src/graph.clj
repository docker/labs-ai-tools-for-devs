(ns graph
  (:require
   claude
   [clojure.core.async :as async]
   [clojure.core.match :refer [match]]
   [clojure.pprint :as pprint]
   [clojure.string :as string]
   git
   jsonrpc
   openai
   prompts
   state
   tools)
  (:import
   [java.net ConnectException]))

(set! *warn-on-reflection* true)

(defn- stop-looping [c s]
  (jsonrpc/notify :error {:content s})
  (async/>!! c {:messages [{:role "assistant" :content s}]
                :finish-reason "error"}))

(def providers {:openai [openai/chunk-handler openai/openai]
                :claude [claude/chunk-handler claude/sample]})
(defn llm-provider [model]
  (cond
    (nil? model) :openai
    (some #(string/starts-with? model %) ["gpt"]) :openai
    (some #(string/starts-with? model %) ["claude"]) :claude
    :else :openai))

(comment
  (llm-provider nil)
  (llm-provider "gpt-4")
  (llm-provider "claude-3.5-sonnet-latest")
  (providers (llm-provider "claude-3.5-sonnet-latest")))

(defn run-llm
  "call openai compatible chat completion endpoint and handle tool requests
    params
      messages   is the conversation history
      metadata   from the initial prompt
      functions  definition for functions referenced in the initial prompt
      opts       for running the model
    returns channel that will contain an coll of messages"
  [{:keys [messages functions metadata] {:keys [url model stream level]} :opts}]
  (let [[chunk-handler sample] (providers (llm-provider (or (:model metadata) model)))
        [c h] (chunk-handler)
        request (merge
                 (dissoc metadata :agent :host-dir :workdir :prompt-format :description :name :parameter-values :arguments :resources :defs) ; TODO should we just select relevant keys instead of removing bad ones
                 {:messages (->> messages (map #(dissoc % :name :description)))
                  :level level}
                 (when (seq functions) {:tools functions})
                 ;; overrides from cli opts, NOT from metadata
                 (when url {:url url})
                 (when model {:model model})
                 ;; stream is a special case where we don't want to allow override of the metadata val if the cli val is set 
                 (when (and stream (nil? (:stream metadata))) {:stream stream}))]
    (try
      (if (seq messages)
        (sample request h)
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

(defn start
  "create starting messages, metadata, and functions to bootstrap the thread"
  [_]
  (async/go {}))

(defn end
  "merge the :done signal"
  [state]
  (let [c (async/promise-chan)]
    ;; this is a normal ending and we try to add a :done key to the state for this
    (async/put! c {:done (:finish-reason state)})
    c))

(defn completion
  "generate the next AI message
     passes the whole converation to the AI model"
  [state]
  (run-llm state))

(defn tool
  "execute the tool_calls from the last AI message in the conversation"
  [state]
  (let [calls (-> (:messages state) last :tool_calls)]
    (async/go
      ;; tool-calls 
      {:messages
       (into []
             (async/<!
              (->> (tools/make-tool-calls
                    (or (-> state :opts :level) 0)
                    (partial
                     tools/function-handler
                      ;; defaults for tool handling are opts, current state functions, and a host-dir override
                     (merge
                      (:opts state)
                      (select-keys state [:functions])
                        ;; note that host-dir, if it exists, is an override here
                      (select-keys (:metadata state) [:host-dir :timeout :workdir])))
                    calls)
                   (async/reduce conj []))))})))

(defn tool-node
  "add a tool node that will run tool_calls from the last AI message in the conversation"
  [_]
  tool)

(defn tools-query
  [_]
  (async/go {}))

(defn require-graph [s]
  (let [graphs-ns-symbol (symbol (format "graphs.%s" s))]
    (require graphs-ns-symbol)
    (ns-resolve graphs-ns-symbol 'graph)))

(declare stream chat-with-tools)

(defn apply-functions [coll]
  (fn [state]
    (reduce (fn [m f] (f state m)) state coll)))

(defn sub-graph-node
  "create a sub-graph node that initializes a conversation from the current one,
   creates a new agent graph from the current state and returns the messages to be added 
   to the parent conversation"
  [{:keys [init-state construct-graph next-state]}]
  (fn [state]
    (async/go
      (try
        (let [new-conversation-state
              (->
                ((or
                   ;; the sub-graph might have a function or a vector of state overlays to apply 
                   (and
                     init-state
                     (if (coll? init-state)
                       (apply-functions init-state)
                       init-state))
                   ;; default is to assume there's a tool call with a function that contains a prompt
                   (comp state/construct-initial-state-from-prompts state/add-prompt-ref)) state)
                (update-in [:opts :level] (fnil inc 0)))

              sub-graph-state
              (async/<!
                (stream
                  ((or construct-graph
                       (if-let [agent (-> new-conversation-state :metadata :agent)]
                         (require-graph agent)
                         chat-with-tools)) state)
                  (-> new-conversation-state
                      (update-in [:metadata] dissoc :agent))))]
          ((or next-state state/add-last-message-as-tool-call) state sub-graph-state))
        (catch Throwable t
          (jsonrpc/notify :error {:content (str t)})
          {:error (format "unable to enter sub-graph: %s" t)})))))

; =====================================================
; edge functions takes state and returns next node
; =====================================================

(defn tool-or-end
  "after a completion, check whether you need to make a tool call"
  [state]
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

(defn state-reducer
  "reduce the state with the change from running a node"
  [state change]
  (jsonrpc/notify :message {:debug (format "---\n%s\n---\n%s\n---\n" 
                                           (with-out-str (pprint/pprint (state/summarize state)))
                                           (with-out-str (pprint/pprint change)))})
  (-> state
      (merge (dissoc change :messages :tools))
      (update :messages concat (:messages change))
      (update :functions (fnil concat []) (:tools change))))

(defn stream
  "start streaming a conversation"
  ([graph] (stream graph {}))
  ([graph m]
   (async/go-loop
    [state m
     node "start"]
     (jsonrpc/notify :message {:debug (format "\n-> entering %s\n\n" node)})
     ;; TODO handling bad graphs with missing nodes
     (let [enter-node (get-in graph [:nodes node])
           new-state (state-reducer state (async/<! (enter-node state)))]
       (if (= "end" node)
         new-state
         ;; TODO check for :done keys and possibly bail
         ;; transition to the next state
         ;; TODO handling missing edges
         (recur new-state ((get-in graph [:edges node]) new-state)))))))

(defn update-graph [m l x]
  (match [x]

         ; create an edge from the last node to this one 
    [[(n1 :guard string?)]] (cond-> m
                              true (add-edge l n1))

         ; add a conditional edge from the last node to this function 
    [[:edge (n2 :guard (comp not string?))]] (cond-> m
                                               l (add-conditional-edges
                                                  l
                                                  n2))

         ; 
    [[n1 (n2 :guard (comp not string?))]] (cond-> m
                                            true (add-node n1 n2)
                                            l (add-edge l n1))

    :else m))

(defn path-item [{:keys [m l]} [n1 :as item]]
  {:m (update-graph m l item)
   :l (when (not (= :edge n1)) n1)})

(defn paths [agg p]
  (:m (reduce path-item {:m agg} p)))

(defn construct-graph [x]
  (reduce paths {} x))

; ============================================================
; this is the graph we tend to use in our experiments thus far
; ============================================================

(defn chat-with-tools [_]
  (construct-graph
   [[["start"       start]
     ["completion"  completion]
     [:edge         tool-or-end]]
    [["sub-graph"   (sub-graph-node {})]
     ["completion"]]
    [["tool"        (tool-node {})]
     ["completion"]]
    [["end"         end]]]))

(defn generate-one-tool-call [_]
  (construct-graph
   [[["start"       start]
     ["completion"  completion]
     [:edge         tool-or-end]]
    [["sub-graph"   (sub-graph-node {})]
     ["end"         end]]
    [["tool"        (tool-node {})]
     ["end"]]]))

; requires finish-reason to be set to tool_calls
; runs either a tool or sub-graph and then ends
(defn generate-start-with-tool [_]
  (construct-graph
   [[["start"       start]
     [:edge         tool-or-end]]
    [["sub-graph"   (sub-graph-node {})]
     ["end"         end]]
    [["tool"        (tool-node {})]
     ["end"]]]))


(ns state
  (:require
   [babashka.fs :as fs]
   [clojure.pprint :refer [pprint]]
   git
   jsonrpc
   prompts
   tools))

(set! *warn-on-reflection* true)

(defn each [& fs]
  (fn [coll]
    (->> coll
         (map #(reduce (fn [m f] (f m)) %1 fs)))))

(defn summarize-arguments [m]
  (update-in m [:function :arguments] (fn [s] (format "... json length %d ..." (count s)))))
(defn summarize-content [m]
  (update m :content (fn [c] (format "... %d characters ..." (count c)))))
(defn summarize-tool-calls [m]
  (update-in m [:tool_calls] (each summarize-arguments)))

(defn summarize [state]
  (-> state
      (update :messages (each
                          ;summarize-content 
                          ;summarize-tool-calls
                         ))))

(defn prompt? [m]
  (= "prompt" (-> m :function :type)))

(defn get-function-definition [{:keys [messages functions]}]
  (when-let [message (last messages)]
    (->> functions
         ;; TODO only supports one tool call at a time
         (filter #(or
                   (=
                    (-> message :tool_calls first :function :name)
                    (-> % :function :name))
                   (=
                    (-> message :tool_calls first :function :name)
                    (-> % :name))))
         first)))

(def prompt-tool? (comp prompt? get-function-definition))

(defn add-tool-call-id [m id] (assoc m :role "tool" :tool_call_id id))

; ========================================
; operate on conversation state
; ========================================

(defn construct-initial-state-from-prompts [_ {{:keys [prompts] :as opts} :opts :as state}]
  (try
    (-> state
        (merge
         {:metadata (prompts/collect-metadata prompts)
          :functions (prompts/collect-functions prompts)})
        (update
         :messages
         (fnil concat [])
         (when (not (seq (:messages state)))
           (let [new-prompts (prompts/get-prompts opts)]
             (jsonrpc/notify :prompts {:messages new-prompts})
             new-prompts))))
    (catch Throwable ex
      (jsonrpc/notify :error {:content
                              (format "failure for prompt configuration:\n %s" (with-out-str (pprint (dissoc opts :pat :jwt))))
                              :exception (str ex)}))))

(defn tools-append [tools]
  (fn [_ state]
    (-> state
        (update-in [:functions] (fnil concat []) tools))))

(defn tools-set [tools]
  (fn [_ state]
    (-> state
        (update-in [:functions] (constantly tools)))))

(defn tools-reset []
  (fn [_ state]
    (dissoc state :functions)))

(defn messages-reset [] 
  (fn  [_ state]
    (dissoc state :messages)))

(defn messages-take-last [n]
  (fn [orig state]
    (-> state
        (update-in [:messages] (fnil concat []) (take-last n (:messages orig))))))

(defn messages-take [n]
  (fn [orig state]
    (-> state
        (update-in [:messages] (fnil concat []) (take n (:messages orig))))))

(defn messages-append [coll]
  (fn [_ state]
    (-> state
        (update-in [:messages] (fnil concat []) coll))))

(defn messages-append-all []
  (fn [orig state]
    (-> state
        (update-in [:messages] (fnil concat []) (:messages orig)))))

(defn messages-from-prompt [s]
  (fn [orig state]
    (-> state
        (update-in [:opts :prompts] (constantly (fs/file s)))
        ((partial construct-initial-state-from-prompts orig)))))

(defn add-prompt-ref
  [_ state]
  (let [definition (state/get-function-definition state)
        arg-context (let [raw-args (-> state :messages last :tool_calls first :function :arguments)]
                      (tools/arg-context raw-args))]
    (-> state
        (dissoc :messages)
        (update-in [:opts :prompts] (constantly (git/prompt-file (-> definition :function :ref))))
        (update-in [:opts :parameters] (constantly arg-context)))))

; =========================================================
; produce the diffs that should be applied to the next state
; =========================================================

(defn add-last-message-as-tool-call
  [state sub-graph-state]
  {:messages [(-> sub-graph-state
                  :messages
                  last
                  (state/add-tool-call-id (-> state :messages last :tool_calls first :id)))]})

(defn append-new-messages
  [state sub-graph-state]
  {:messages (->> (:messages sub-graph-state)
                  (filter (complement (fn [m] (some #(= m %) (:messages state))))))})

(defn take-last-messages
  [n]
  (fn
    [_ sub-graph-state]
    {:messages (->> (:messages sub-graph-state)
                    (take-last n))}))



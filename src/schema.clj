(ns schema)

(def container-function-definition
  {:type "function"
   :function
   {:name ""
    :description ""
    :parameters
    {:type "object"
     :properties
     {}}
    :container
    {:image ""
     :command []}}})

(def prompt-function-definition
  {:type "prompt"
   :ref ".."
   :name ""
   :description ""
   :parameters 
   {}})

(def tool-message
  {:role "assistant"
   :tool_calls
   [{:id "tool-call-id"
     :function
     {:name ""
      :arguments "serialized json"}}]})

(def message
  {:role ""
   :content ""})

(def state
  {:messages []
   :metadata {}
   :opts {}
   :functions []})

(ns schema 
  (:require
   [babashka.fs :as fs]))

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
  {:type "function"
   :function
   {:type "prompt"
    :ref ".."
    :name ""
    :description ""
    :parameters 
    {}}})

(def tool-message
  {:role ""
   :content ""
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
   :opts 
   {:jsonrpc true
    :host-dir ""
    :debug true
    :prompts #'fs/file
    :stream true
    :jwt ""
    :save-thread-volume true
    :thread-id ""
    :user ""
    :platform ""}
   :functions []})

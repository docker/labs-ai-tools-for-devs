(ns openai-t
  (:require
   [clojure.core.async :as async]
   [clojure.test :as t]
   [jsonrpc]
   [openai])
  (:import
   [java.net ConnectException]))

(t/deftest update-tool-calls
  (t/is
   (=
    {:tool-calls 
     {"fid" 
      {:function {:name "echo", :arguments "some stuff"}, 
       :id "fid"}}}
    (reduce
     openai/update-tool-calls
     {}
     [[{:id "fid" :function {:name "echo"}}]
      [{:id "fid" :function {:arguments "some"}}]
      [{:id "fid" :function {:arguments " stuff"}}]]))))

(comment

  ;; when we cannot connect, verify that we throw an exception
  (try
    (let [[c cb] (openai/chunk-handler)]
      (openai/openai
       {:messages [{:content "What is the meaning of life?" :role "user"}]
        :url "https://does.not.exist"}
       cb)
      (async/<!! c))
    (catch ConnectException t
      t))

  (let [[c cb] (openai/chunk-handler)]
    (openai/openai
     {:messages [{:content "What is the meaning of life?" :role "user"}]
      :model "llama3:latest"
      :url "http://localhost:11434/v1/chat/completions"}
     cb)
    (async/<!! c))

  (openai/openai
   {:messages [{:content "use a function to echo back to me a 10 line poem" :role "user"}]
    :tools [{:type "function"
             :function {:name "echo"
                        :description "echo something back to me"
                        :parameters
                        {:type "object"
                         :properties
                         {:content {:type "string"
                                    :description "the content to echo back"}}}}}]}
   (second (openai/chunk-handler))))

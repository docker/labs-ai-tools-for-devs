(ns ollama-openai-tools
  (:require [openai]
            [prompts]
            [babashka.fs :as fs]))

(openai/openai 
  {:model "mistral-nemo"
   :stream false
   :temperature -1
   :url "http://localhost:11434/v1/chat/completions"
   :messages [{:role "user" :content "Use a tool to lint the clojure code in this project by passing the arguments `--lint .`."}]
   :tools (prompts/collect-functions (fs/file "prompts/clj-kondo/"))} 
  println)

(openai/openai 
  {:model "llama3.1"
   :stream true
   :url "http://localhost:11434/v1/chat/completions"
   :messages [{:role "user" :content "Use a tool to the clojure code in this project by passing the arguments `--lint .`."}]
   :tools (prompts/collect-functions (fs/file "prompts/clj-kondo/"))} 
  println)

(openai/openai 
  {:stream false
   :messages [{:role "user" :content "Lint the clojure code in this project by passing the arguments `--lint .`."}]
   :tools (prompts/collect-functions (fs/file "prompts/clj-kondo/"))} 
  println)

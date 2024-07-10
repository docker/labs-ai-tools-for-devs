(ns dev.ollama
  (:require
   [prompts]
   [babashka.curl :as curl]
   [babashka.process :as p]
   [cheshire.core :as json]
   [clojure.pprint :as pprint]
   [selmer.parser :as selmer.parser]
   [clojure.string :as string]))

(def x (p/process
        {:out :string :err :string}
        "docker" 
        "run" 
        "--rm" 
        "vonwig/prompts" 
        "{}" "jimclark106" "darwin"))

(def f "/Users/slim/docker/genai-stack/")

(def x (p/process
        {:out :string :err :string}
        "docker"
        "run"
        "--rm"
        "--interactive"
        "--init"
        "--mount" "type=volume,source=docker-lsp,target=/docker"
        "--mount" (format "type=bind,source=%s,target=/project" f)
        "--entrypoint" "/app/result/bin/docker-lsp"
        "docker/lsp:staging"
        "project-facts"
        "--workspace" "/docker"
        "--vs-machine-id" "none"))

(def y (p/process
        {:out :string :err :string :extra-env {"DOCKER_LSP" "nix"}}
        "nix"
        "run"
        "/Users/slim/docker/lsp#clj"
        "project-facts"
        "--"
        "--pod-exe-path" "/Users/slim/docker/babashka-pod-docker/result/bin/entrypoint"
        "--workspace" "/Users/slim/.docker"
        "--project-root" f 
        "--vs-machine-id" "none"))

(def project-facts
  (-> y
      (deref)
      :out
      (json/parse-string keyword)))

(pprint/pprint project-facts)

(prompts/prompts (json/generate-string (dissoc project-facts :project/dockerfiles)) "jimclark106" "darwin")

(defn ollama [messages]
  (->
    (curl/post "http://localhost:11434/v1/chat/completions"
               {:body (json/generate-string
                        {:model "llama3"
                         :temperature 0.1
                         :messages messages})})
    :body
    (json/parse-string keyword)))

(def api-key "")

(defn openai [messages]
  (->
    (curl/post "https://api.openai.com/v1/chat/completions"
               {:headers {"Authorization" (format "Bearer %s" api-key)
                          "Content-Type" "application/json"}
                :throw false
                :body (json/generate-string
                        {:model "gpt-4"
                         :temperature 0.1
                         :messages messages})})
    :body
    (json/parse-string keyword)))

(-> (with-out-str (prompts/prompts 
                    (json/generate-string project-facts) 
                    "jimclark106" 
                    "darwin"))
    (json/parse-string keyword)
    (openai)
    ;:choices
    ;first
    ;:message
    ;:content
    ;println
    )


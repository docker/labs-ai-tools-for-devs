(ns conversations-t
  (:require
   [babashka.fs :as fs]
   [clojure.core.async :as async]
   [docker.main :as main]
   graph
   jsonrpc))

(def opts {:platform "darwin"
           :prompts (fs/file "/Users/slim/docker/labs-ai-tools-for-devs/prompts/curl/README.md")
           :host-dir "/Users/slim/vonwig/altaservice"})

(try
  (main/with-options opts ["run"])
  (catch Throwable t
    (println t)))

(def run-command (main/command opts "run"))

(try
  (def x (run-command))
  (catch Throwable t
    (println t)))

(->> (:messages x)
     (map :role))

(keys x)
(count (:messages x))

(def y (async/<!! (graph/stream (graph/chat-with-tools opts))))

(count (:messages y))

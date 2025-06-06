(ns start
  (:require
   [babashka.curl :as curl]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [docker.main]
   [http-sse-server]
   [jsonrpc.logger :as logger]
   [jsonrpc.server]
   [lsp4clj.server :as lsp.server]
   [messages]
   [repl])
  (:import
   [java.io BufferedInputStream]))

(comment
  (docker.main/-main "--port" "8811"))

;; set up server 
(def in (async/chan))
(def out (async/chan))
(def server-id 1)
(def server-opts (merge
                  (jsonrpc.server/server-context {:trace-level "verbose"})
                  {:output-ch out
                   :input-ch in}))
(def server (lsp.server/chan-server
             server-opts))
(repl/setup-stdout-logger)
;; start channel server
(lsp4clj.server/start
 server
 ((:server-context-factory server-opts) server server-id))

;; watch output channel
(async/go-loop []
  (if-let [m (async/<! out)]
    (do
      (logger/info "output: " m)
      (recur))
    (logger/info "done")))
;; send some messages
(async/go
  (async/>! in (messages/initialize 0)))

;; now do it across http
(def http-server-opts (jsonrpc.server/server-context {:trace-level "verbose"}))
(repl/setup-stdout-logger)
(http-sse-server/stop-server!)
(http-sse-server/start-server! http-server-opts)
(def response (curl/post "http://localhost:9011/mcp/1"
                         {:body (json/generate-string (messages/initialize 0))
                          :as :stream}))
(.start
 (Thread.
  (fn []
    (loop []
      (let [r (io/reader (BufferedInputStream. (:body response)))]
        (when-let [line (.readLine r)]
          (logger/info line)
          (recur)))))))
(.close (:body response))

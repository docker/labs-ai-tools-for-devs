(ns http-sse-server
  (:require
   [aleph.http :as http]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.state :as state]
   [lsp4clj.server :as lsp.server]
   [manifold.stream :as s]
   [reitit.ring :as ring]))

(defn format-event
  "Return a properly formatted event payload"
  [body]
  (str "data: " (json/generate-string body) "\n\n"))

;; this is for starting an SSE stream without an initial payload
(defn mcp-endpoint-get [_req]
  {:status 200
   :headers {"content-type" "text/event-stream"}
   :body (let [c (async/chan 1 (map format-event))]
           (s/->source c))})

;; check Origin
;; support single request, notification, or response
;;   or batches of either responses or request/notifications
;; if only responses or notifications then 202 with no body is okay
;; can return one application/json response or an text/event-stream
;; if sse, close the stream after all messages have been
(defn mcp-endpoint [server-opts {:keys [body] {tools-id :id} :path-params}]
  (let [in (async/chan)
        out (async/chan 1 (map format-event))
        server-id (or tools-id (swap! jsonrpc.state/server-counter inc))
        s (lsp.server/chan-server
           {:input-ch in
            :output-ch out
            :on-close (fn []
                        (logger/info "closing SSE processor")
                        (async/close! out))})]
    ;; construct a chan server
    (lsp.server/start s ((:server-context-factory server-opts) s server-id))
    (logger/info (format "starting server %d using tool filter %s" tools-id (or (-> @db/db* :tool/filters server-id) [])))
    ;; push in all of the messages and then close
    (async/go
      (if (coll? body)
        (doseq [m body]
          (async/>! in m))
        (async/>! in body))
      (async/close! in))
    ;; return the SSE stream
    {:status 200
     :headers {"content-type" "text/event-stream"}
     :body (s/->source (:ouptut-ch s))}))

(defn create-app
  "Return a ring handler that will route /events to the SSE handler
       and that will servr  static content form project's resource/public directory"
  [server-opts]
  (ring/ring-handler
   (ring/router
    [["/mcp/:id" {:post {:handler (partial mcp-endpoint server-opts)}
                  :get {:handler mcp-endpoint-get}}]])))

((ring/ring-handler (ring/router [["/mcp/:id" {:post {:handler identity}}]]) "/mcp/1")
 {:request-method :post
  :uri "/mcp/1"
  :body "content"})
;; Web server maangement code to make it easy to start and stop a server
    ;; after changesto router or handlers
(def server_ (atom nil))

(defn start-server! [server-opts]
  (reset! server_ (http/start-server (create-app server-opts)
                                     {:port 3000
                                      :join? false})))

(defn stop-server! []
  (swap! server_ (fn [s]
                   (when s
                     (.close s)))))
(comment
  (import [java.io BufferedInputStream])
  (require '[clj-http.client :as client]
           '[clojure.java.io :as io])

  (start-server! {})

  (def response (client/get "http://localhost:8080/mcp" {:as :stream}))

  (.start
   (Thread.
    (fn []
      (loop []
        (when-let [line (.readLine (io/reader (BufferedInputStream. (:body response))))]
          (do
            (println line)
            (recur)))))))

  (stop-server!))


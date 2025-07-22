(ns http-sse-server
  (:require
   [aleph.http :as http]
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.server]
   [jsonrpc.state :as state]
   [lsp4clj.server :as lsp.server]
   [manifold.stream :as s]
   [prompts.core :as prompts]
   [reitit.ring :as ring])
  (:import
   [java.util UUID]))

(def http-port 9011)
(def sse-sessions (atom {}))
(def cors-headers
  {"Access-Control-Allow-Origin" "*"
   "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE"
   "Access-Control-Allow-Headers" "Content-Type, Accept, Origin, Connection"})

;; manage tool definitions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; PUT /mcp/tool/:id
(defn mcp-put-tool-definition [{{tool-id :id} :path-params body :body}]
  (let [tool-definition (slurp body)]
    ;; TODO log a warning if this tool name exists
    (logger/info (format "%s registers \n %s" tool-id tool-definition))
    (spit (fs/file (prompts/get-prompts-dir) (format "%s.md" tool-id)) tool-definition))
  {:status 201
   :headers (merge cors-headers
                   {"Location" (format "/mcp/tool/%s" tool-id)
                    :content-type "application/json"})
   :body (json/generate-string {:url (format "http://host.docker.internal:%s/mcp/tool/%s" http-port tool-id)})})

;; DELETE /mcp/tool/:id
(defn mcp-delete-tool-definition [{{tool-id :id} :path-params}]
  {:headers cors-headers
   :status 200})

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; manage endpoints for streaming clients
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; DELETE /mcp/:id
(defn mcp-delete-tool-endpoint [{{tool-id :id} :path-params}]
  {:heders cors-headers
   :status 200})

;; PUT /mcp/:id
(defn mcp-put-tool-endpoint [server-opts {body :body {tool-id :id} :path-params}]
  (let [body (json/parse-string (slurp body) keyword)
        tool-set (into #{} (:tools body))]
    (swap! db/db* assoc-in [:tool/filters tool-id] tool-set)
    {:status 201
     :headers (merge 
                cors-headers
                {:content-type "application/json"})
     :body (json/generate-string
            {:streaming (format "http://host.docker.internal:%s/mcp/%s" http-port tool-id)
             :sse (format "http://host.docker.internal:%s/sse/%s" http-port tool-id)})}))

(defn format-event
  "Return a properly formatted event payload for streaming clients"
  [body]
  (str "data: " (json/generate-string body) "\n\n"))

(defn sse-event
  "Return a property formatted event payload for http/sse clients"
  [payload]
  (format "event: %s\ndata: %s\n\n"
          (or (:event payload) "message")
          (if (string? (:data payload))
            (:data payload)
            (json/generate-string (or (:data payload) (dissoc payload :event))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Streaming endpoints for clients
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; GET /mcp/:id
(defn mcp-endpoint-get [{body :body {tool-id :id} :path-params}]
  {:status 200
   :headers (merge 
              cors-headers
              {"content-type" "text/event-stream"})
   :body (let [c (async/chan 1 (map format-event))]
           (s/->source c))})

;; check Origin
;; support single request, notification, or response
;;   or batches of either responses or request/notifications
;; if only responses or notifications then 202 with no body is okay
;; can return one application/json response or an text/event-stream
;; if sse, close the stream after all messages have been
;; POST /mcp/:id
(defn mcp-endpoint [server-opts {:keys [body] {tools-id :id} :path-params}]
  (let [in (async/chan)
        out (async/chan 1 (map format-event))
        server-id (or tools-id (swap! jsonrpc.state/server-counter inc))
        message (json/parse-string (slurp body) keyword)
        s (lsp.server/chan-server
           (merge
            server-opts
            {:input-ch in
             :output-ch out
             :on-close (fn []
                         (logger/info "closing SSE processor")
                         (async/close! out))}))]
    (try
      (lsp.server/start s ((:server-context-factory server-opts) s server-id))

      (logger/info
       (format "starting server %s using tool filter %s" server-id (or (-> @db/db* :tool/filters (get server-id)) [])))
      ;; push in all of the messages and then close
      (async/go
        (cond
          (map? message)
          (async/>! in message)
          (coll? message)
          (doseq [m message]
            (async/>! in m))
          :else
          (logger/warn "dropped message " message))
        #_(async/close! in))
      ;; return the SSE stream
      {:status 200
       :headers (merge 
                  cors-headers
                  {"content-type" "text/event-stream"})
       :body (s/->source (:output-ch s))}
      (catch Throwable t
        (logger/error t)
        {:status 500
         :body (str "Error: " t)}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Http/SSE endpoints
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; GET /sse/:id (HTTP/SSE event channel)
(defn mcp-sse-stream-endpoint [server-opts {{tools-id :id} :path-params}]
  (let [in (async/chan)
        out (async/chan 1 (map sse-event))
        server-id (or tools-id (swap! jsonrpc.state/server-counter inc))
        session-id (str (UUID/randomUUID))
        s (lsp.server/chan-server
           (merge
            server-opts
            {:input-ch in
             :output-ch out
             :on-close (fn []
                         (logger/info "closing SSE processor")
                         (async/close! out))}))]
    (lsp.server/start s ((:server-context-factory server-opts) s server-id))
    ;; TODO write the url to the output-ch
    (async/put! out {:event "endpoint" :data (format "/sse/%s/%s" tools-id session-id)})
    ;; connect the input-ch to this session-id so we can write messages into it when they're posted.
    (swap! sse-sessions assoc session-id {:input-channel in
                                          :tools-id tools-id})
    {:status 200
     :headers (merge 
                cors-headers
                {"content-type" "text/event-stream"})
     :body (s/->source out)}))

;; POST /sse/:id/:sessionid
(defn mcp-sse-write-endpoint [{{session-id :session-id tool-id :id} :path-params body :body}]
  ;; TODO write to the output channel of this session
  (let [message (json/parse-string (slurp body) keyword)]
    (async/put! (get-in @sse-sessions [session-id :input-channel]) message)
    {:status 201}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn create-app
  "Return a ring handler that will route /events to the SSE handler
       and that will servr  static content form project's resource/public directory"
  [server-opts]
  (ring/ring-handler
   (ring/router
    [["/mcp/:id" {:post {:handler (partial #'mcp-endpoint server-opts)}
                  :get {:handler mcp-endpoint-get}
                  :put {:handler (partial #'mcp-put-tool-endpoint server-opts)}
                  :delete {:handler #'mcp-delete-tool-endpoint}}]

     ;; create tool urls
     ["/mcp/tool/:id" {:put {:handler #'mcp-put-tool-definition}
                       :delete {:handler #'mcp-delete-tool-definition}}]
     ;; connect http/sse
     ["/sse/:id" {:get {:handler (partial #'mcp-sse-stream-endpoint server-opts)}}]
     ["/sse/:id/:session-id" {:post {:handler #'mcp-sse-write-endpoint}}]])))

;; Web server maangement code to make it easy to start and stop a server
    ;; after changesto router or handlers
(def server_ (atom nil))

(defn start-server! [server-opts p]
  (reset! server_ {:server (http/start-server (create-app server-opts)
                                              {:port http-port})
                   :p p}))

(defn stop-server! []
  (swap! server_ (fn [{:keys [server p]}]
                   (when server
                     {:server (.close server)
                      :p (deliver p :done)}))))

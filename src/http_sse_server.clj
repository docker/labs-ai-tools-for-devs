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

(def next-port
  (atom {:tools->port {}
         :port 8811}))

(defn get-next-port [state tool-set]
  (let [port (inc (:port state))]
    (-> state
        (assoc :port port)
        (update :tools->port assoc tool-set port))))

(def sse-sessions (atom {}))

(defn mcp-put-tool-definition [{{tool-id :id} :path-params}]
  {:status 201
   :headers {"Location" (format "/mcp/tool/%s" tool-id)
             :content-type "application/json"}
   :body (json/generate-string {:url (format "http://host.docker.internal:%s/mcp/tool/%s" http-port tool-id)})})

(defn mcp-delete-tool-definition [{{tool-id :id} :path-params}]
  {:status 200})

(defn mcp-delete-tool-endpoint [{{tool-id :id} :path-params}]
  {:status 200})

(defn mcp-put-tool-endpoint [server-opts {body :body {tool-id :id} :path-params}]
  (let [body (json/parse-string (slurp body) keyword)
        tool-set (into #{} (:tools body))]
    (swap! db/db* assoc-in [:tool/filters tool-id] tool-set)
    (logger/info "Received JSON body:" body)
    {:status 201
     :headers {:content-type "application/json"}
     :body (json/generate-string
            {:streaming (format "http://host.docker.internal:%s/mcp/%s" http-port tool-id)
             :sse (format "http://host.docker.internal:%s/sse/%s" http-port tool-id)})}))

(defn format-event
  "Return a properly formatted event payload"
  [body]
  (str "data: " (json/generate-string body) "\n\n"))

(defn sse-event [payload]
  (format "event: %s\ndata: %s\n\n"
          (or (:event payload) "message")
          (if (string? (:data payload))
            (:data payload)
            (json/generate-string (or (:data payload) (dissoc payload :event))))))

;; this is for starting an SSE stream without an initial payload
(defn mcp-endpoint-get [{body :body {tool-id :id} :path-params}]
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
        message (json/parse-string (slurp body) keyword)
        s (lsp.server/chan-server
           (merge
            server-opts
            {:input-ch in
             :output-ch out
             :on-close (fn []
                         (logger/info "closing SSE processor")
                         (async/close! out))}))]
    ;; construct a chan server
    (logger/info (format "starting chan server %s" server-id))
    (try
      (lsp.server/start s ((:server-context-factory server-opts) s server-id))

      (logger/info
       (format "starting server %s using tool filter %s" server-id (or (-> @db/db* :tool/filters (get server-id)) [])))
      ;; push in all of the messages and then close
      (logger/info "message " message)
      (async/go
        (cond
          (map? message)
          (do
            (logger/info "sending" (str message))
            (async/>! in message))
          (coll? message)
          (doseq [m message]
            (async/>! in m))
          :else
          (logger/info "dropped messasge " message))
        #_(async/close! in))
      ;; return the SSE stream
      {:status 200
       :headers {"content-type" "text/event-stream"}
       :body (s/->source (:output-ch s))}
      (catch Throwable t
        (logger/error t)
        {:status 500
         :body (str "Error: " t)}))))

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
    (logger/info (format "starting chan server %s" server-id))
    (lsp.server/start s ((:server-context-factory server-opts) s server-id))
    ;; TODO write the url to the output-ch
    (async/put! out {:event "endpoint" :data (format "/sse/%s/%s" tools-id session-id)})
    ;; connect the input-ch to this session-id so we can write messages into it when they're posted.
    (swap! sse-sessions assoc session-id {:input-channel in
                                          :tools-id tools-id})
    {:status 200
     :headers {"content-type" "text/event-stream"}
     :body (s/->source (:output-ch s))}))

(defn mcp-sse-write-endpoint [{{session-id :session-id tool-id :id} :path-params body :body}]
  ;; TODO write to the output channel of this session
  (async/put! (get-in @sse-sessions [session-id :input-channel]) (json/parse-string (slurp body)))
  {:status 201})

(defn mcp-tools-put-endpoint [{{tool-name :name} :path-params body :body}]
  (let [tool-definition (slurp body)]
    ;; TODO log a warning if this tool name exists
    (logger/info (format "%s registers \n %s" tool-name tool-definition))
    (spit (fs/file (prompts/get-prompts-dir) (format "%s.md" tool-name)) tool-definition)))

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
     ["/mcp/tool/:id" {:put {:handler #'mcp-put-tool-definition}
                       :delete {:handler #'mcp-delete-tool-definition}}]
     ["/sse/:id" {:get {:handler (partial #'mcp-sse-stream-endpoint server-opts)}}]
     ["/sse/:id/:seesion-id" {:post {:handler #'mcp-sse-write-endpoint}}]
     ["/mcp/tools/:name" {:put {:handler #'mcp-tools-put-endpoint}}]])))

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

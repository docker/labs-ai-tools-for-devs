(ns http-server
  (:require
   [babashka.curl :as curl]
   [compojure.core :refer [POST routes]]
   [compojure.route :as route]
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.server]
   [ring.adapter.jetty :as jetty]
   [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
   [ring.util.response :refer [response]]))

(def next-port
  (atom {:tools->port {}
         :port 8811}))

(defn get-next-port [state tool-set]
  (let [port (inc (:port state))]
    (-> state
        (assoc :port port)
        (update :tools->port assoc tool-set port))))

(defn app-routes [server-opts]
  ;; POST route for /tools that accepts JSON
  (routes
   (POST "/tools" request
     (let [body (:body request)
           tool-set (into #{} (:tools body))
           port (if-let [next-port ((:tools->port @next-port) tool-set)]
                  next-port 
                  (:port (swap! next-port get-next-port tool-set)))]
       (swap! db/db* assoc-in [:tool/filters port] tool-set)
       (logger/info "Received JSON body:" body)
       (logger/info "Create new endpoint on port: " port)
       (jsonrpc.server/run-socket-server! {:port port} (merge server-opts {:tools tool-set}))
       (response {:port port
                  :host "host.docker.internal"
                  :sse (format "http://host.docker.internal:3000/mcp/%s" port)})))

   ;; Handle 404 Not Found
   (route/not-found "Not Found")))

(defn app [server-opts]
  (-> (app-routes server-opts)
      wrap-json-response
      (wrap-json-body {:keywords? true})))

(defn start [server-opts]
  (logger/info "Server starting on port 3000")
  (jetty/run-jetty (app server-opts) {:port 3000 :join? true}))

(comment
  (require '[cheshire.core :as json])
  ;; For REPL development
  (def server (jetty/run-jetty app {:port 3000 :join? false}))
  (curl/post "http://localhost:3000/tools" {:body (json/generate-string {:tools []})
                                            :headers {"Content-Type" "application/json"}})
  (.stop server))

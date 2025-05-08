(ns http-server
  (:require
   [babashka.curl :as curl]
   [compojure.core :refer [GET POST routes]]
   [compojure.route :as route]
   [jsonrpc.logger :as logger]
   [jsonrpc.server]
   [ring.adapter.jetty :as jetty]
   [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
   [ring.util.response :refer [response]]))

(def next-port (atom 8811))

(defn app-routes [server-opts]
  ;; POST route for /tools that accepts JSON
  (routes
    (POST "/tools" request
          (let [body (:body request)
                port (swap! next-port inc) ]
            (logger/info "Received JSON body:" body)
            (logger/info "Create new endpoint on port: " port)
            (jsonrpc.server/run-socket-server! {:port port} server-opts)
            (response {:port port
                       :host "host.docker.internal"})))

    ;; Default route for root path
    (GET "/" []
         {:status 200
          :headers {"Content-Type" "text/html"}
          :body "Hello, World! This is a simple Jetty server in Clojure."})

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
                                            :headers {"Content-Type" "application/json"} })
  (.stop server))

(ns http-server
  (:require [ring.adapter.jetty :as jetty]
            [compojure.core :refer [defroutes POST GET]]
            [ring.util.response :refer [response]]
            [compojure.route :as route]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            [babashka.curl :as curl]
            ))

(defroutes app-routes
  ;; POST route for /tools that accepts JSON
  (POST "/tools" request
    (let [body (:body request)]
      (println "Received JSON body:" body)
      (response {:message "Received your request" 
                 :received body})))
  
  ;; Default route for root path
  (GET "/" []
    {:status 200
     :headers {"Content-Type" "text/html"}
     :body "Hello, World! This is a simple Jetty server in Clojure."})
  
  ;; Handle 404 Not Found
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      wrap-json-response
      (wrap-json-body {:keywords? true})))

(defn start []
  (println "Server starting on port 3000")
  (jetty/run-jetty app {:port 3000 :join? true}))

(comment
  (require '[cheshire.core :as json])
  ;; For REPL development
  (def server (jetty/run-jetty app {:port 3000 :join? false}))
  (curl/post "http://localhost:3000/tools" {:body (json/generate-string {:tools []})
                                            :headers {"Content-Type" "application/json"} })
  (.stop server))

(ns tunnel
  (:require [org.httpkit.server :as server]
            [cheshire.core :as json]
            [babashka.process :as p]))

(defn handler [req]
  (let [s (slurp (:body req))]
    {:status 200 
     :headers {"Content-Type" "application/json"} 
     :body (json/generate-string {})}))

(def http-server 
  (server/run-server 
    #'handler 
    {:port 10101
     :legacy-return-value? false}))

(comment
  (server/server-stop! http-server))

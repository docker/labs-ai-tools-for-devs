(ns init
  (:require
   [babashka.fs :as fs]
   [babashka.http-client :as http]
   [cheshire.core :as json]
   [clojure.string :as string]))

(def language-gateway-endpoint "https://api.scout.docker.com/v1/language-gateway")

(defn- recommendation-request [image]
  (http/post
   (format "%s/%s" language-gateway-endpoint "image")
   {:body (json/generate-string {:image image})}))

(defn- recommendation-response [response]
  response)

(defn -command [& args]
  (try
    (let [repository (:repository (json/parse-string (second args) true))]
      (println 
        #_((comp recommendation-response recommendation-request) repository)
        "22-slim"))
    (catch Throwable t
      (binding [*out* *err*]
        (println t))
      (System/exit 1))))

(defn -main []
  (apply -command *command-line-args*))

(comment
  (let [args ["/Users/slim/project"
              (json/generate-string {:repository "alpine"})]]
    (apply -command args)))

(-main)


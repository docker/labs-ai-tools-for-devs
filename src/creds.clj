(ns creds
  (:require [babashka.fs :as fs]
            [babashka.process :as process]
            [cheshire.core :as json]))

(defn credential-helper 
  "doesn't work without a HOME and docker desktop install"
  [key]
  (let [path (fs/file (.get (System/getenv) "HOME") ".docker" "config.json")]
    (when (.exists path)
      (when-let [cred-store (-> (slurp path) (json/parse-string keyword) :credsStore)]
        (try
          (->
            (process/process [(format "docker-credential-%s" cred-store) "get"]
                             {:out :string :in key})
            (deref)
            :out
            (json/parse-string keyword))
          (catch Throwable _))))))

(defn credential-helper->jwt 
  "doesn't work without a HOME and docker desktop install"
  []
  (:Secret (credential-helper "https://index.docker.io/v1//access-token")))

(comment
  (credential-helper->jwt))


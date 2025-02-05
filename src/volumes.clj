(ns volumes
  (:require
   [cheshire.core :as json]
   docker
   [jsonrpc.logger :as logger]
   script
   [clojure.test :as t]))

(defn with-volume
  "callback with the thread-id for this conversation, make sure the thread volume exists
   and possibly remove the volume afterwards"
  [f & {:keys [thread-id save-thread-volume]}]
  (let [thread-id (or thread-id (str (random-uuid)))]
    (try
      (docker/thread-volume {:Name thread-id})
      (f thread-id)
      (finally
        (when (not (true? save-thread-volume))
          (docker/delete-thread-volume {:Name thread-id}))))))

(comment
  ;; mcp resources should e structured like this
  {:type "resource"
   :resource
   {:uri "resource://example"
    :mimeType "text/plain"
    :text "Resource Content"}})

(defn pick-up-mcp-resources
  " returns a coll of mcp resources picked up for a thread"
  [thread-id callback]
  (try
    (-> (docker/run-container
          {:image "vonwig/bb:latest"
           :thread-id thread-id
           :command [(json/generate-string
                       {:directory "/thread"} keyword)
                     (script/read-script-at-compile-time "src/volumes/collect.clj")]})
        :pty-output
        (json/parse-string keyword)
        ((fn [resources] (callback resources) resources)))
    (catch Throwable t
      (logger/error t "error collecting mcp resources")
      {})))

(comment
  (script/read-script-at-compile-time "src/volumes/collect.clj"))

(comment
  (->
    (docker/run-container
      {:image "vonwig/bb:latest"
       :volumes ["/Users/slim:/project"]
       :workdir "/project"
       :command [(json/generate-string
                   {:directory "/project"})
                 (script/read-script-at-compile-time "src/volumes/collect.clj")]})
    :pty-output
    #_(json/parse-string keyword)))


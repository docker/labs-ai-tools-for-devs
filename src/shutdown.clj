(ns shutdown
  (:require
   [jsonrpc.logger :as logger]))

(def hooks (atom []))

(def connection-hooks (atom {}))

(defn on-connection-close [server-id]
  (doseq [f (get @connection-hooks server-id)]
    (try
      (f)
      (catch Throwable t
        (logger/error t "during connection shutdown"))))
  (swap! connection-hooks dissoc server-id))

(defn schedule-container-shutdown [f]
  (swap! hooks conj f))

(defn init []
  (.addShutdownHook
   (Runtime/getRuntime)
   (Thread.
    (fn []
      (doseq [f @hooks]
        (try
          (f)
          (catch Throwable t
            (logger/error t "during shutdown"))))))))

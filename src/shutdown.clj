(ns shutdown
  (:require
   [jsonrpc.logger :as logger]))

(def hooks (atom []))

(defn schedule-container-shutdown [f]
  (swap! hooks conj f))

(defn init []
  (logger/info "scheduled container shutdown hook")
  (.addShutdownHook
   (Runtime/getRuntime)
   (Thread.
    (fn []
      (doseq [f @hooks]
        (try
          (f)
          (catch Throwable t
            (logger/error t "during shutdown"))))))))

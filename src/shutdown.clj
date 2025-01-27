(ns shutdown 
  (:require
   [jsonrpc.logger :as logger]))

(defn schedule-container-shutdown [f]
  (logger/info "scheduled container shutdown hook")
  (.addShutdownHook
    (Runtime/getRuntime)
    (Thread. 
      (fn []
        (try
          (f)
          (catch Throwable t
            (logger/error t "during shutdown")))))))

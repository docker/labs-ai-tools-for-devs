(ns repl
  (:require
   [babashka.fs :as fs]
   [jsonrpc.logger :as logger :refer [ILogger]]
   [taoensso.timbre :as timbre]
   [taoensso.timbre.appenders.core :as appenders]))

(defn log! [level args fmeta]
  (timbre/log! level :p args {:?line (:line fmeta)
                              :?file (:file fmeta)
                              :?ns-str (:ns-str fmeta)}))

(def stdout-logger
  (reify ILogger
    (setup [this]
      (let [log-path (str (fs/file "./log/docker-mcp-server.out"))]
        (timbre/merge-config! {:middleware [#(assoc % :hostname_ "")]
                               :appenders {:println {:enabled? true}
                                           :spit (appenders/spit-appender {:fname log-path})}})
        (timbre/handle-uncaught-jvm-exceptions!)
        (logger/set-logger! this)
        log-path))

    (set-log-path [_this log-path]
      (timbre/merge-config! {:appenders {:spit (appenders/spit-appender {:fname log-path})}}))

    (-info [_this fmeta arg1] (log! :info [arg1] fmeta))
    (-info [_this fmeta arg1 arg2] (log! :info [arg1 arg2] fmeta))
    (-info [_this fmeta arg1 arg2 arg3] (log! :info [arg1 arg2 arg3] fmeta))
    (-warn [_this fmeta arg1] (log! :warn [arg1] fmeta))
    (-warn [_this fmeta arg1 arg2] (log! :warn [arg1 arg2] fmeta))
    (-warn [_this fmeta arg1 arg2 arg3] (log! :warn [arg1 arg2 arg3] fmeta))
    (-error [_this fmeta arg1] (log! :error [arg1] fmeta))
    (-error [_this fmeta arg1 arg2] (log! :error [arg1 arg2] fmeta))
    (-error [_this fmeta arg1 arg2 arg3] (log! :error [arg1 arg2 arg3] fmeta))
    (-debug [_this fmeta arg1] (log! :debug [arg1] fmeta))
    (-debug [_this fmeta arg1 arg2] (log! :debug [arg1 arg2] fmeta))
    (-debug [_this fmeta arg1 arg2 arg3] (log! :debug [arg1 arg2 arg3] fmeta))))

(defn setup-stdout-logger []
  (logger/setup stdout-logger)
  )


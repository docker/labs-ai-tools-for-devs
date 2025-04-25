(ns jsonrpc.logger 
  (:require
   [babashka.fs :as fs]
   [taoensso.timbre :as timbre]
   [taoensso.timbre.appenders.core :as appenders]))

(defprotocol ILogger
  (setup [this])

  (set-log-path [_this log-path])

  (-info [this fmeta arg1] [this fmeta arg1 arg2] [this fmeta arg1 arg2 arg3])
  (-warn [this fmeta arg1] [this fmeta arg1 arg2] [this fmeta arg1 arg2 arg3])
  (-error [this fmeta arg1] [this fmeta arg1 arg2] [this fmeta arg1 arg2 arg3])
  (-debug [this fmeta arg1] [this fmeta arg1 arg2] [this fmeta arg1 arg2 arg3]))

(def ^:dynamic *logger*
  "Optional logger state to avoid having component available everywhere."
  nil)

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defn set-logger! [logger]
  (alter-var-root #'*logger* (constantly logger)))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defmacro info [& args]
  (let [fmeta (assoc (meta &form)
                     :file *file*
                     :ns-str (str *ns*))]
    `(when *logger*
       (-info *logger* ~fmeta ~@args))))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defmacro warn [& args]
  (let [fmeta (assoc (meta &form)
                     :file *file*
                     :ns-str (str *ns*))]
    `(when *logger*
       (-warn *logger* ~fmeta ~@args))))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defmacro error [& args]
  (let [fmeta (assoc (meta &form)
                     :file *file*
                     :ns-str (str *ns*))]
    `(when *logger*
       (-error *logger* ~fmeta ~@args))))

#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defmacro debug [& args]
  (let [fmeta (assoc (meta &form)
                     :file *file*
                     :ns-str (str *ns*))]
    `(when *logger*
       (-debug *logger* ~fmeta ~@args))))

(defn trace
  ([x] (info "trace " x) x)
  ([s x] (info (format "%s %s" s x)) x))

(defn log! [level args fmeta]
  (timbre/log! level :p args {:?line (:line fmeta)
                              :?file (:file fmeta)
                              :?ns-str (:ns-str fmeta)}))

(defn decide-log-path []
  (let [prompts-dir (fs/file "/prompts")]
    (if (fs/exists? prompts-dir)
      (do
        (fs/create-dirs (fs/file prompts-dir "log"))
        (fs/file prompts-dir "log/docker-mcp-server.out"))
      (do
        (fs/create-dirs (fs/file "./log"))
        (fs/file "./log/docker-mcp-server.out")))))

(defrecord TimbreLogger []
  ILogger
  (setup [this]
    (let [log-path (str (decide-log-path))]
      (timbre/merge-config! {:middleware [#(assoc % :hostname_ "")]
                             :appenders {:println {:enabled? false}
                                         :spit (appenders/spit-appender {:fname log-path})}})
      (timbre/handle-uncaught-jvm-exceptions!)
      (set-logger! this)
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
  (-debug [_this fmeta arg1 arg2 arg3] (log! :debug [arg1 arg2 arg3] fmeta)))


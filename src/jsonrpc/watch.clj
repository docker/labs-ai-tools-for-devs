(ns jsonrpc.watch
  (:require
   [babashka.process :as process]
   [clj-yaml.core :as yaml]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.string :as string]
   [jsonrpc.logger :as logger]))

(def watcher-args
  ["inotifywait" "-e" "modify" "-e" "create" "-e" "delete" "-m" "-q" "/prompts"])

; split on white space
; only care about registry.yaml
;/prompts/ DELETE registry.yaml
;/prompts/ CREATE registry.yaml
;/prompts/ MODIFY registry.yaml

(defn init [cb]
  (async/go
    (let [p (apply process/process {:out :stream} watcher-args)
          rdr (io/reader (:out p))]
      (for [line (line-seq rdr) :let [[_ event f] (string/split line #"\s+")]]
        (do
          (logger/info (format "event: %s file: %s" event f))
          (when (= f "registry.yaml")
            (cb
             (try
               (yaml/parse-string (slurp "/prompts/registry.yaml"))
               (catch Throwable _
                 {})))))))))

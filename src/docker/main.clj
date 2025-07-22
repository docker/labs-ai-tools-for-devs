(ns docker.main
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clj-yaml.core :as yaml]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   docker
   git
   [http-sse-server]
   jsonrpc
   [jsonrpc.logger :as logger]
   jsonrpc.producer
   jsonrpc.server
   [logging :refer [warn]]
   prompts
   schema
   trace
   volumes)
  (:gen-class))

(set! *warn-on-reflection* true)

(def cli-opts [;; optional
               [nil "--offline" "do not try to pull new images"]
               ;; optional
               [nil "--thread-id THREAD_ID" "use this thread-id for the next conversation"
                :assoc-fn (fn [m k v] (assoc m k v :save-thread-volume true))]
               [nil "--stream" "stream responses"
                :id :stream
                :default true
                :assoc-fn (fn [m k _] (assoc m k true))]
               [nil "--nostream" "disable streaming responses"
                :id :stream
                :assoc-fn (fn [m k _] (assoc m k false))]
               [nil "--register ref" "register a prompt REF"
                :multi true
                :default []
                :update-fn conj]
               [nil "--port PORT" "run a socket server"
                :parse-fn #(Long/parseLong %)]
               [nil "--debug" "add debug logging"]
               [nil "--transport TRANSPORT" "set transport type"]
               [nil "--help" "print option summary"]
               [nil "--config CONFIG" "gateway configuration"]])

(def output-handler (fn [x]
                      (jsonrpc/notify
                       :message
                       {:content
                        (json/generate-string
                         (cond
                           (map? x) (select-keys x [:done])
                           (nil? x) {}
                           :else x))})))

(defn command [opts & [c :as args]]
  (fn []
    (let [server-opts (jsonrpc.server/server-context
                       (merge
                        (dissoc opts :config)
                        (when (:config opts)
                          (try
                            (let [m (yaml/parse-string (:config opts))]
                              {:gateway m})
                            (catch Throwable t
                              (println "Error parsing gateway config" t))))))
          p (promise)]
      (cond 
        (:port opts)
        (jsonrpc.server/run-socket-server! opts server-opts)
        (= "stdio" (:transport opts))
        (jsonrpc.server/run-server! opts server-opts)
        :else
        (http-sse-server/start-server! server-opts p))
      @p)))

(defn -main [& args]
  (try
    (let [{:keys [arguments options errors summary]} (cli/parse-opts args cli-opts)]
      (if (seq errors)
        (do
          (warn
           "Errors: {{errors}}\nSummary:\n{{summary}}"
           {:summary summary :errors (string/join "\n" errors)})
          (System/exit 1))
        (if (:help options)
          (do
            (println summary)
            (System/exit 0))
          (let [cmd (apply command options arguments)]
            (alter-var-root
             #'jsonrpc/notify
             (fn [_] (if (:jsonrpc options)
                       jsonrpc/-notify
                       (jsonrpc/create-stdout-notifier options))))
            (output-handler
             (try
               (cmd)
               (catch Throwable t
                 (.printStackTrace t)
                 (jsonrpc/notify :error {:content (str t)})
                 (System/exit 1))))))))
    (catch Throwable t
      (.printStackTrace t)
      (warn "Error: {{ exception }}" {:exception t})
      (System/exit 1))))

(ns docker.main
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   docker
   git
   [http-server]
   [http-sse-server]
   jsonrpc
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
               [nil "--jsonrpc" "Output JSON-RPC notifications"]
               ;; optional
               [nil "--url OPENAI_COMPATIBLE_ENDPOINT" "OpenAI compatible endpoint url"]
               ;; required if not using positional args
               [nil "--user USER" "The hub user"]
               ;; optional
               [nil "--pat PAT" "personal access token"]
               ;; can not validate this without a host helper
               [nil "--host-dir DIR" "Project directory (on host filesystem)"]
               ;; required if not using positional args
               [nil "--platform PLATFORM" "current host platform"
                :validate [#(#{"darwin" "linukjx" "windows"} (string/lower-case %)) "valid platforms are Darwin|Linux|Windows"]]
               [nil "--prompts-dir DIR_PATH" "path to local prompts directory"
                :id :prompts
                :validate [#(fs/exists? (fs/file %)) "prompts dir does not a valid directory"]
                :parse-fn #(fs/file %)]
               [nil "--prompts-file PROMPTS_FILE" "path to local prompts file"
                :id :prompts
                :validate [#(fs/exists? (fs/file %)) "prompts file does not exist"]
                :parse-fn #(fs/file %)]
               [nil "--prompts REF" "git ref to remote prompts directory"
                :id :prompts
                :validate [git/parse-github-ref "not a valid github ref"
                           git/prompt-file "could not resolve github ref"]
                :assoc-fn (fn [m k v] (assoc m k (git/prompt-file v)))]
               ;; optional
               [nil "--offline" "do not try to pull new images"]
               ;; optional
               [nil "--pretty-print-prompts" "pretty print prompts"]
               ;; optional
               [nil "--thread-id THREAD_ID" "use this thread-id for the next conversation"
                :assoc-fn (fn [m k v] (assoc m k v :save-thread-volume true))]
               [nil "--model MODEL" "use this model on the openai compatible endpoint"]
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
               [nil "--mcp" "use the mcp jsonrpc protocol"]
               [nil "--port PORT" "run a socket server"
                :parse-fn #(Long/parseLong %)]
               [nil "--debug" "add debug logging"]
               [nil "--help" "print option summary"]])

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
    (let [server-opts (jsonrpc.server/server-context opts)
          p (promise)]
      (jsonrpc.server/run-socket-server! opts server-opts)
      (http-sse-server/start-server! server-opts p)
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

(ns docker.main
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   docker
   git
   [git.registry :as registry]
   graph
   jsonrpc
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   jsonrpc.producer
   jsonrpc.server
   [logging :refer [warn]]
   prompts
   schema
   state
   trace
   user-loop
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
                :validate [#(#{"darwin" "linux" "windows"} (string/lower-case %)) "valid platforms are Darwin|Linux|Windows"]]
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

(defn output-prompts [coll]
  (->> coll
       (mapcat (fn [{:keys [role content]}]
                 [(format "## %s\n" role)
                  content]))
       (interpose "\n")
       (apply str)
       ((fn [s] (jsonrpc/notify :message {:content s})))))

(defn merge-deprecated [opts & args]
  (let [[host-dir user platform dir-or-ref] args]
    (merge opts
           (when (and host-dir user platform dir-or-ref)
             {:host-dir host-dir
              :user user
              :platform platform
              :prompts (or
                        (let [f (fs/file dir-or-ref)]
                          (when (fs/exists? f) f))
                        (git/prompt-file dir-or-ref))}))))

(defn login-info []
  (if-let [{:keys [token id is-logged-in?]} (docker/get-login-info-from-desktop-backend)]
    (cond
      (and is-logged-in? token id)
      {:jwt token
       :user id}
      is-logged-in?
      (warn "Docker Desktop logged in but creds not available" {})
      :else
      (warn "Docker Desktop not logged in" {}))
    (warn "unable to check Docker Desktop for login" {})))

(defn with-options [opts args]
  ((schema/validate :schema/run-args)
   (merge
    (apply merge-deprecated opts args)
    (login-info))))

(defn command [opts & [c :as args]]
  (case c
    "prompts" (fn []
                (concat
                 [{:type "docker" :title "using docker in my project"}
                  {:type "lazy_docker" :title "using lazy-docker"}]
                 (->> (:prompts (registry/read-registry))
                      (map #(assoc % :saved true)))))
    "register" (fn []
                 (if-let [{:keys [owner repo path]} (git/parse-github-ref (second args))]
                   (registry/update-registry (fn [m]
                                               (update-in m [:prompts] (fnil conj [])
                                                          {:type (second args)
                                                           :title (format "%s %s %s"
                                                                          owner repo
                                                                          (if path (str "-> " path) ""))})))
                   (throw (ex-info "Bad GitHub ref" {:ref (second args)}))))
    "unregister" (fn []
                   (registry/update-registry
                    (fn [m]
                      (update-in m [:prompts] (fn [coll] (remove (fn [{:keys [type]}] (= type (second args))) coll))))))
    "run" (fn []
            (logger/setup (jsonrpc.server/->TimbreLogger))

            (let [[in send]
                  (let [[[w c] in] (user-loop/create-pipe)]
                    [in (fn []
                          (w (jsonrpc/request "exit" {} (constantly 1)))
                          (c))])]
              (send)
              (volumes/with-volume
                (fn [thread-id]
                  (async/<!!
                   (user-loop/start-jsonrpc-loop
                    (fn [state]
                      (let [m (state/construct-initial-state-from-prompts
                               (assoc state :opts
                                      (-> (with-options opts (rest args))
                                          (assoc :thread-id thread-id))))]
                        (graph/stream
                         (if (-> m :metadata :agent)
                           ((graph/require-graph (-> m :metadata :agent)) state)
                           (graph/chat-with-tools state))
                         m)))
                    user-loop/state-reducer
                    in
                    {})))
                opts)))
    "serve" (fn []
              (let [server-opts (jsonrpc.server/server-context opts)
                    [producer server-promise] (if (:port opts)
                                                (jsonrpc.server/run-socket-server! opts server-opts)
                                                (jsonrpc.server/run-server! opts server-opts))]
                (alter-var-root
                 #'jsonrpc/notify
                 (constantly
                  (fn [method params]
                    (jsonrpc.producer/publish-docker-notify producer method params))))
                (let [finished @server-promise]
                  {:result-code (if (= :done finished) 0 1)})))
    (fn []
      (:messages (prompts/get-prompts (with-options opts args))))))

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
            ((if (:pretty-print-prompts options)
               output-prompts
               output-handler)
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

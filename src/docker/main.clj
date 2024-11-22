(ns docker.main
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.spec.alpha :as s]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   docker
   git
   [git.registry :as registry]
   graph
   jsonrpc
   [logging :refer [warn]]
   prompts
   state
   trace
   user-loop)
  (:gen-class))

(set! *warn-on-reflection* true)

(defn- with-volume 
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
               [nil "--debug" "add debug logging"]
               [nil "--input" "read jsonrpc messages from stdin"]
               [nil "--help" "print option summary"]])

(def output-handler (fn [x]
                      (jsonrpc/notify
                       :message
                       {:content
                        (json/generate-string
                         (if (map? x)
                           (select-keys x [:done])
                           x))})))

(defn output-prompts [coll]
  (->> coll
       (mapcat (fn [{:keys [role content]}]
                 [(format "## %s\n" role)
                  content]))
       (interpose "\n")
       (apply str)
       ((fn [s] (jsonrpc/notify :message {:content s})))))

(s/def ::platform (fn [s] (#{:darwin :linux :windows} (keyword (string/lower-case s)))))
(s/def ::user string?)
(s/def ::jwt string?)
(s/def ::pat string?)
(s/def ::prompts #(fs/exists? %))
(s/def ::host-dir string?)
(s/def ::offline boolean?)
(s/def ::thread-id string?)
(s/def ::save-thread-volume boolean?)
(s/def ::url string?)
(s/def ::run-args (s/keys :req-un [::platform ::prompts ::host-dir]
                          :opt-un [::offline ::thread-id ::save-thread-volume ::user ::pat ::jwt ::url]))

(defn validate [k]
  (fn [opts]
    (if (s/valid? k opts)
      opts
      (throw (ex-info "invalid args" {:explanation (s/explain-data k opts)})))))

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
  ((validate ::run-args)
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
            (let [[in send]
                  (if (:input opts)
                    [*in* (constantly true)]
                    (let [[[w c] in] (user-loop/create-pipe)]
                      [in (fn []
                            (w (jsonrpc/request "exit" {} (constantly 1)))
                            (c))]))]
              (send)
              (with-volume
                (fn [thread-id]
                  (async/<!!
                   (user-loop/start-jsonrpc-loop
                    (user-loop/create-step
                     (fn [state]
                       (let [m (state/construct-initial-state-from-prompts
                                (assoc state :opts
                                       (-> (with-options opts (rest args))
                                           (assoc :thread-id thread-id))))]
                         (graph/stream
                          (if (-> m :metadata :agent)
                            ((graph/require-graph (-> m :metadata :agent)) state)
                            (graph/chat-with-tools state))
                          m))))
                    user-loop/state-reducer
                    in
                    {}))
                  (trace/dump))
                opts)))
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
            (when (and
                   (not (:host-dir options))
                   (< (count arguments) 2))
              (warn
               "you must specify a --host-dir option.  
                 This is the directory that will be provided to tool containers as /project." {})
              (System/exit 1))
            (alter-var-root
             #'jsonrpc/notify
             (fn [_] (partial (if (:jsonrpc options) jsonrpc/-notify jsonrpc/-println) options)))
            ((if (:pretty-print-prompts options) output-prompts output-handler)
             (cmd))))))
    (catch Throwable t
      (.printStackTrace t)
      (warn "Error: {{ exception }}" {:exception t})
      (System/exit 1))))

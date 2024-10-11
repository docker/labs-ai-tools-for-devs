(ns prompts
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.pprint :refer [pprint]]
   [clojure.spec.alpha :as s]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   creds
   [docker]
   [git]
   [git.registry]
   [jsonrpc]
   [logging :refer [warn]]
   [markdown :as markdown-parser]
   [markdown.core :as markdown]
   [medley.core :as medley]
   [openai]
   [pogonos.core :as stache]
   [pogonos.partials :as partials]
   [registry]
   [selmer.parser :as selmer])
  (:import
   [java.net ConnectException]))

(defn- facts
  "fix up facts before sending to templates"
  [project-facts user platform]
  (medley/deep-merge
   {:platform platform
    :username user
    :project-facts {:files (-> project-facts :project-facts :project/files)
                    :dockerfiles (-> project-facts :project-facts :project/dockerfiles)
                    :composefiles (-> project-facts :project-facts :project/composefiles)
                    :languages (-> project-facts :project-facts :github/lingust)}
    :languages (->> project-facts
                    :github/linguist
                    keys
                    (map name)
                    (string/join ", "))}
   project-facts))

(defn- name-matches [re]
  (fn [p] (re-matches re (fs/file-name p))))

(defn fact-reducer
  "reduces into m using a container function
     params
       host-dir - the host dir that the container will mount read-only at /project
       m - the map to merge into
       container-definition - the definition for the function
     returns
       map of json decoded data keyed by the extractor name"
  [host-dir m container-definition]
  (try
    (medley/deep-merge
     m
     (let [{:keys [pty-output exit-code]} (docker/extract-facts
                                           (-> container-definition
                                               (assoc :host-dir host-dir)))]
       (when (= 0 exit-code)
         (let [context
               (case (:output-handler container-definition)
                 ;; we have one output-handler registered right now - it extracts the vals from a map
                 "linguist" (->> (json/parse-string pty-output keyword) vals (into []))
                 (json/parse-string pty-output keyword))]
           (if-let [extractor-name (:name container-definition)]
             {(keyword extractor-name) context}
             context)))))
    (catch Throwable ex
      (jsonrpc/notify
       :error
       {:content
        (logging/render
         "unable to run extractors \n```\n{{ container-definition }}\n```\n"
         {:dir host-dir
          :container-definition (str container-definition)})
        :exception (str ex)})
      m)))

(defn- metadata-file [prompts-file]
  (if (fs/directory? prompts-file) (io/file prompts-file "README.md") prompts-file))

(defn collect-extractors [f]
  (let [extractors (->>
                    (-> (try
                          (markdown/parse-metadata (metadata-file f))
                          (catch Throwable _
                             ;; files with empty strings will throw assertion failures
                            nil))
                        first
                        :extractors)
                    (map (fn [m] (merge (registry/get-extractor m) m))))]
    (if (seq extractors)
      extractors
      [])))

(def hub-images
  #{"curl" "qrencode" "toilet" "figlet" "gh" "typos" "fzf" "jq" "fmpeg" "pylint" "imagemagick"})

(defn collect-functions
  "get either :functions or :tools collection
    returns collection of openai compatiable tool definitions augmented with container info"
  [f]
  (try
    (->>
     (->
      (markdown/parse-metadata (metadata-file f))
      first
      (select-keys [:tools :functions])
      seq
      first  ;; will take the first either tools or functions randomly 
      second ;; returns the tools or functions array
      )
     (mapcat
      (fn [m]
        (if-let [tool (hub-images (:name m))]
            ;; these come from our own public hub images
          [{:type "function"
            :function
            {:name (format "%s-manual" tool)
             :description (format "Run the man page for %s" tool)
             :container
             {:image (format "vonwig/%s:latest" tool)
              :command
              ["{{raw|safe}}" "man"]}}}
           {:type "function"
            :function
            (merge
             {:description (format "Run a %s command." tool)
              :parameters
              {:type "object"
               :properties
               {:args
                {:type "string"
                 :description (format "The arguments to pass to %s" tool)}}}
              :container
              {:image (format "vonwig/%s:latest" tool)
               :command ["{{raw|safe}}"]}}
             m)}]
          [{:type "function" :function (merge (registry/get-function m) (dissoc m :image))}]))))
    (catch Throwable _
      ;; TODO warn about empty yaml front matter?
      [])))

(defn collect-metadata
  "collect metadata from yaml front-matter in README.md
    skip functions and extractors"
  [f]
  (try
    (dissoc
     (-> (markdown/parse-metadata (metadata-file f)) first)
     :extractors :functions)
    (catch Throwable _
      ;; TODO warn about empty yaml front matter?
      {})))

(defn run-extractors
  "returns a map of extracted *math-context*
     params
       project-root - the host project root dir
       identity-token - a valid Docker login auth token
       dir - a prompts directory with a valid README.md"
  [{:keys [host-dir prompts user jwt]}]
  (reduce
   (partial fact-reducer host-dir)
   {}
   (->> (collect-extractors prompts)
        (map (fn [m] (merge m
                            (when user {:user user})
                            (when jwt {:jwt jwt})))))))

(defn- selma-render [prompts-file m message]
  (update message
          :content
          (fn [content]
            (stache/render-string
             content
             m
             {:partials (partials/file-partials
                         [(if (fs/directory? prompts-file) prompts-file (fs/parent prompts-file))]
                         ".md")}))))

(def prompt-file-pattern #".*_(.*)_.*.md")

(defn get-prompts
  "run extractors and then render prompt templates
     returns ordered collection of chat messages"
  [{:keys [parameters prompts user platform] :as opts}]
  (let [;; TODO the docker default no longer makes sense here
        m (merge (run-extractors opts) parameters)
        renderer (partial selma-render prompts (facts m user platform))
        prompts (if (fs/directory? prompts)
                  ;; directory based prompts
                  (->> (fs/list-dir prompts)
                       (filter (name-matches prompt-file-pattern))
                       (sort-by fs/file-name)
                       (map (fn [f] {:role (let [[_ role] (re-find prompt-file-pattern (fs/file-name f))] role)
                                     :content (slurp (fs/file f))}))
                       (into []))
                  ;; file based prompts
                  (try
                    (let [p (slurp prompts)]
                      (markdown-parser/parse-markdown p))
                    (catch Throwable t
                      (jsonrpc/notify :error {:content (format "failed to parse prompts from markdown %s" t)})
                      [])))]
    (map renderer prompts)))

(defn interpolate [m template]
  (selmer/render template m {}))

(declare conversation-loop)

(defn function-handler
  "make openai tool call
   supports container tool definitions and prompt tool definitions 
   (prompt tools can have their own child tools definitions)
   does not stream - calls resolve or fail only once 
   should not throw exceptions
     params
       opts - options map for the engine
       function-name - the name of the function that the LLM has selected
       json-arg-string - the JSON arg string that the LLM has generated
       resolve fail - callbacks"
  [{:keys [functions user jwt timeout level] :as opts :or {level 0}} function-name json-arg-string {:keys [resolve fail]}]
  (if-let [definition (->
                       (->> (filter #(= function-name (-> % :function :name)) functions)
                            first)
                       :function)]
    (let [arg-context (merge
                              ;; TODO raw is a bad name when merging
                       {:raw (if json-arg-string
                               json-arg-string
                               "{}")}
                       (when json-arg-string (json/parse-string json-arg-string true)))]
      (try
        (cond
          (:container definition) ;; synchronous call to container function
          (let [function-call (merge
                               (:container definition)
                               (dissoc opts :functions)
                               {:command (into []
                                               (concat
                                                []
                                                (->>
                                                 (-> definition :container :command)
                                                 (map (partial interpolate arg-context))
                                                 (into []))))}
                               (when user {:user user})
                               (when jwt {:jwt jwt})
                               (when timeout {:timeout timeout}))
                {:keys [pty-output exit-code done] :as result} (docker/run-container function-call)
                exit-code-fail? (if (false? (:check-exit-code definition))
                                  false
                                  (not= 0 exit-code))]
            (cond
              (and (= :exited done) (not exit-code-fail?))
              (resolve pty-output)
              (and (= :exited done) exit-code-fail?)
              (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))
              (= :timeout done)
              (fail (format "call timed out: %s" (:timeout result)))
              :else
              (fail (format "call failed"))))

          (= "prompt" (:type definition)) ;; asynchronous call to another agent - new conversation-loop
          (do
            (jsonrpc/notify :start {:level level
                                    :role "tool"
                                    :content (:ref definition)})
            (let [{:keys [messages _finish-reason]}
                  (async/<!! (conversation-loop
                              (assoc opts
                                     :level (inc (or (:level opts) 0))
                                     :prompts (git/prompt-file (:ref definition))
                                     :parameters arg-context)))]
              (resolve (->> messages
                            (filter #(= "assistant" (:role %)))
                            (last)
                            :content))))
          :else
          (fail (format "bad container definition %s" definition)))
        (catch Throwable t
          (fail (format "system failure %s" t)))))
    (fail "no function found")))

(defn- stop-looping [c s]
  (jsonrpc/notify :error {:content s})
  (async/>!! c {:messages [{:role "assistant" :content s}]
                :finish-reason "error"}))

(defn- run-prompts
  "call openai compatible chat completion endpoint and handle tool requests
    params
      prompts is the conversation history
      args for extracting functions, host-dir, user, platform
    returns channel that will contain the final set of messages and a finish-reason"
  [messages {:keys [prompts url model stream level] :as opts :or {level 0}}]
  (let [m (collect-metadata prompts)
        functions (collect-functions prompts)
        [c h] (openai/chunk-handler
               level
               (partial
                function-handler
                (merge
                 opts
                 (select-keys m [:timeout])
                 {:functions functions})))]
    (try
      (if (seq messages)
        (openai/openai
         (merge
          m
          {:messages messages
           :level level}
          (when (seq functions) {:tools functions})
          (when url {:url url})
          (when model {:model model})
          (when (and stream (nil? (:stream m))) {:stream stream})) h)
        (stop-looping c "This is an empty set of prompts.  Define prompts using h1 sections (eg `# prompt user`)" ))
      (catch ConnectException _
        (stop-looping c "I cannot connect to an openai compatible endpoint."))
      (catch Throwable t
        (stop-looping c (str t))))
    c))

(defn- conversation-loop
  "thread loop for an openai compatible endpoint
     returns messages and done indicator"
  [opts]
  (try
    (let [new-prompts (get-prompts opts)]
      (jsonrpc/notify :prompts {:messages new-prompts})
      (async/go-loop [thread []]
                     ;; get-prompts can only use extractors - we can't refine
                     ;; them based on output from function calls that the LLM plans
        (let [prompts (if (not (seq thread))
                        new-prompts
                        thread)
              {:keys [messages finish-reason] :as m}
              (async/<!! (run-prompts prompts opts))]
          (if (= "tool_calls" finish-reason)
            (do
              (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
              (recur (concat prompts messages)))
            (do
              (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
              {:messages (concat prompts messages) :done finish-reason})))))
    (catch Throwable ex
      (let [c (async/promise-chan)]
        (jsonrpc/notify :error {:content
                                (format "failure for prompt configuration:\n %s" (with-out-str (pprint (dissoc opts :pat :jwt))))
                                :exception (str ex)})
        (async/>! c {:messages [] :done "error"})
        c))))

(comment
  ;; for testing conversation-loop in repl
  (def x {:stream true,
          :host-dir "/Users/slim/docker/labs-make-runbook",
          :prompts "/Users/slim/docker/labs-ai-tools-for-devs/prompts/hub/default.md"
          :platform "darwin", :user "jimclark106",
          :thread-id "3e61ffe7-840e-4177-b84a-f6f7db58b24d"})
  (get-prompts x)
  (run-extractors x)
  (collect-extractors (:prompts x))
  (async/<!! (conversation-loop
              x)))

(defn- with-volume [f & {:keys [thread-id save-thread-volume]}]
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

(defn command [opts & [c :as args]]
  (case c
    "prompts" (fn []
                (concat
                 [{:type "docker" :title "using docker in my project"}
                  {:type "lazy_docker" :title "using lazy-docker"}]
                 (->> (:prompts (git.registry/read-registry))
                      (map #(assoc % :saved true)))))
    "register" (fn []
                 (if-let [{:keys [owner repo path]} (git/parse-github-ref (second args))]
                   (git.registry/update-registry (fn [m]
                                                   (update-in m [:prompts] (fnil conj [])
                                                              {:type (second args)
                                                               :title (format "%s %s %s"
                                                                              owner repo
                                                                              (if path (str "-> " path) ""))})))
                   (throw (ex-info "Bad GitHub ref" {:ref (second args)}))))
    "unregister" (fn []
                   (git.registry/update-registry
                    (fn [m]
                      (update-in m [:prompts] (fn [coll] (remove (fn [{:keys [type]}] (= type (second args))) coll))))))
    "run" (fn []
            (with-volume
              (fn [thread-id]
                (async/<!! ((comp conversation-loop (validate ::run-args))
                            (-> opts
                                (assoc :thread-id thread-id)
                                ((fn [opts] (merge
                                             (apply merge-deprecated opts (rest args))
                                             (login-info))))))))

              opts))
    (fn []
      ((comp get-prompts (validate ::run-args)) (merge
                                                 (apply merge-deprecated opts args)
                                                 (login-info))))))

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


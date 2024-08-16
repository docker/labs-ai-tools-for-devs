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
   [markdown.core :as markdown]
   [medley.core :as medley]
   [openai]
   [pogonos.core :as stache]
   [pogonos.partials :as partials]
   [registry])
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

(defn- selma-render [prompts-dir m f]
  [{:content (stache/render-string
              (slurp f)
              m
              {:partials (partials/file-partials [prompts-dir] ".md")})} f])

(def prompt-file-pattern #".*_(.*)_.*.md")

(defn- merge-role [[m f]]
  (merge m {:role (let [[_ role] (re-find prompt-file-pattern (fs/file-name f))] role)}))

(defn fact-reducer
  "reduces into m using a container function
     params
       dir - the host dir that the container will mount read-only at /project
       m - the map to merge into
       container-definition - the definition for the function"
  [dir m container-definition]
  (try
    (medley/deep-merge
     m
     (let [{:keys [pty-output exit-code]} (docker/extract-facts
                                           (-> container-definition
                                               (assoc :host-dir dir)))]
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
      (warn
       "unable to run extractors \n```\n{{ container-definition }}\n```\n - {{ exception }}"
       {:dir dir
        :container-definition (str container-definition)
        :exception (str ex)})
      m)))

(defn collect-extractors [dir]
  (let [extractors (->>
                    (-> (markdown/parse-metadata (io/file dir "README.md")) first :extractors)
                    (map (fn [m] (merge (registry/get-extractor m) m))))]
    (if (seq extractors)
      extractors
      [{:name "project-facts"
        :image "docker/lsp:latest"
        :entrypoint "/app/result/bin/docker-lsp"
        :command ["project-facts"
                  "--vs-machine-id" "none"
                  "--workspace" "/project"]}])))

(defn collect-functions [dir]
  (->>
   (-> (markdown/parse-metadata (io/file dir "README.md")) first :functions)
   (map (fn [m] {:type "function" :function (merge (registry/get-function m) m)}))))

(defn collect-metadata
  "collect metadata from yaml front-matter in README.md
    skip functions and extractors"
  [dir]
  (dissoc
   (-> (markdown/parse-metadata (io/file dir "README.md")) first)
   :extractors :functions))

(defn run-extractors
  "returns a map of extracted *math-context*
     params
       project-root - the host project root dir
       identity-token - a valid Docker login auth token
       dir - a prompts directory with a valid README.md"
  [{:keys [host-dir prompts-dir user pat] :as opts}]
  (reduce
   (partial fact-reducer host-dir)
   {}
   (->> (collect-extractors prompts-dir)
        (map (fn [m] (merge m
                            (when user {:user user})
                            (when pat {:pat pat})))))))

(defn get-prompts
  "run extractors and then render prompt templates
     returns ordered collection of chat messages"
  [{:keys [prompts-dir user platform] :as opts}]
  (let [;; TODO the docker default no longer makes sense here
        m (run-extractors opts)
        renderer (partial selma-render prompts-dir (facts m user platform))
        prompts (->> (fs/list-dir prompts-dir)
                     (filter (name-matches prompt-file-pattern))
                     (sort-by fs/file-name)
                     (into []))]
    (map (comp merge-role renderer fs/file) prompts)))

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
  [{:keys [functions user pat] :as opts} function-name json-arg-string {:keys [resolve fail]}]
  (if-let [definition (->
                       (->> (filter #(= function-name (-> % :function :name)) functions)
                            first)
                       :function)]
    (try
      (cond
        (:container definition) ;; synchronous call to container function
        (let [function-call (merge
                             (:container definition)
                             (dissoc opts :functions)
                             {:command (concat
                                        []
                                        (if json-arg-string [json-arg-string] ["{}"])
                                        (when-let [c (-> definition :container :command)] c))}
                             (when user {:user user})
                             (when pat {:pat pat}))
              {:keys [pty-output exit-code]} (docker/run-function function-call)]
          (if (= 0 exit-code)
            (resolve pty-output)
            (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))))
        (= "prompt" (:type definition)) ;; asynchronous call to another agent - new conversation-loop
        ;; TODO set a custom map for prompts in the next conversation loop
        (do
          (jsonrpc/notify :message {:content (format "## (%s) sub-prompt" (:ref definition))})
          (let [{:keys [messages _finish-reason] :as m}
                (async/<!! (conversation-loop
                            (assoc opts :prompts-dir (git/prompt-dir (:ref definition)))))]
            (jsonrpc/notify :message {:content (format "## (%s) end sub-prompt" (:ref definition))})
            (resolve (->> messages
                          (filter #(= "assistant" (:role %)))
                          (last)
                          :content))))
        :else
        (fail (format "bad container definition %s" definition)))
      (catch Throwable t
        (fail (format "system failure %s" t))))
    (fail "no function found")))

(defn- run-prompts
  "call openai compatible chat completion endpoint and handle tool requests
    params
      prompts is the conversation history
      args for extracting functions, host-dir, user, platform
    returns channel that will contain the final set of messages and a finish-reason"
  [prompts {:keys [prompts-dir url model stream] :as opts}]
  (let [m (collect-metadata prompts-dir)
        functions (collect-functions prompts-dir)
        [c h] (openai/chunk-handler (partial
                                     function-handler
                                     (merge
                                      opts
                                      {:functions functions})))]
    (try
      (openai/openai
       (merge
        m
        {:messages prompts}
        (when (seq functions) {:tools functions})
        (when url {:url url})
        (when model {:model model})
        (when (and stream (nil? (:stream m))) {:stream stream})) h)
      (catch ConnectException _
        ;; when the conversation-loop can not connect to an openai compatible endpoint
        (async/>!! c {:messages [{:role "assistant" :content "I cannot connect to an openai compatible endpoint."}]
                      :finish-reason "error"}))
      (catch Throwable t
        (async/>!! c {:messages [{:role "assistant" :content (str t)}]
                      :finish-reason "error"})))
    c))

(defn- conversation-loop
  "thread loop for an openai compatible endpoint
     returns messages and done indicator"
  [opts]
  (async/go-loop
   [thread []]
    ;; get-prompts can only use extractors - we can't refine
    ;; them based on output from function calls that the LLM plans
    (let [prompts (if (not (seq thread))
                    (get-prompts opts)
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
               ;; only required for internal users
               [nil "--pat PAT" "A hub PAT"]
               ;; required if not using positional args
               ;; can not validate this without a host helper
               [nil "--host-dir DIR" "Project directory (on host filesystem)"]
               ;; required if not using positional args
               [nil "--platform PLATFORM" "current host platform"
                :validate [#(#{"darwin" "linux" "windows"} (string/lower-case %)) "valid platforms are Darwin|Linux|Windows"]]
               [nil "--prompts-dir DIR_PATH" "path to local prompts directory"
                :id :prompts-dir
                :validate [#(fs/exists? (fs/file %)) "prompts dir does not a valid directory"]
                :parse-fn #(fs/file %)]
               [nil "--prompts REF" "git ref to remote prompts directory"
                :id :prompts-dir
                :validate [git/parse-github-ref "not a valid github ref"
                           git/prompt-dir "could not resolve github ref"]
                :assoc-fn (fn [m k v] (assoc m k (git/prompt-dir v)))]
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
                      (jsonrpc/notify :message {:content (json/generate-string (if (= "error" (:done x))
                                                                                 (update x :messages last) 
                                                                                 (select-keys x [:done])))})))
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
(s/def ::pat string?)
(s/def ::prompts-dir #(fs/exists? %))
(s/def ::host-dir string?)
(s/def ::offline boolean?)
(s/def ::thread-id string?)
(s/def ::save-thread-volume boolean?)
(s/def ::url string?)
(s/def ::run-args (s/keys :req-un [::platform ::user ::prompts-dir ::host-dir]
                          :opt-un [::offline ::thread-id ::save-thread-volume ::pat ::url]))

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
              :prompts-dir (or
                            (let [f (fs/file dir-or-ref)]
                              (when (fs/exists? f) f))
                            (git/prompt-dir dir-or-ref))}))))

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
                                ((fn [opts] (apply merge-deprecated opts (rest args))))))))

              opts))
    (fn []
      ((comp get-prompts (validate ::run-args)) (apply merge-deprecated opts args)))))

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
             (fn [_] (partial (if (:jsonrpc options) jsonrpc/-notify jsonrpc/-println) options)))
            ((if (:pretty-print-prompts options) output-prompts output-handler)
             (cmd))))))
    (catch Throwable t
      (warn "Error: {{ exception }}" {:exception t})
      (System/exit 1))))


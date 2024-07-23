(ns prompts
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.pprint :refer [pprint]]
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
    :project {:files (-> project-facts :project/files)
              :dockerfiles (-> project-facts :project/dockerfiles)
              :composefiles (-> project-facts :project/composefiles)
              :languages (-> project-facts :github/lingust)}
    :languages (->> project-facts
                    :github/linguist
                    keys
                    (map name)
                    (string/join ", "))}
   project-facts))

(defn- name-matches [re]
  (fn [p] (re-matches re (fs/file-name p))))

(defn- selma-render [prompt-dir m f]
  [{:content (stache/render-string
              (slurp f)
              m
              {:partials (partials/file-partials [prompt-dir] ".md")})} f])

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
         (case (:output-handler container-definition)
           "linguist" (->> (json/parse-string pty-output keyword) vals (into []) (assoc {} :linguist))
           (json/parse-string pty-output keyword)))))
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
      [{:image "docker/lsp:latest"
        :entrypoint "/app/result/bin/docker-lsp"
        :command ["project-facts"
                  "--vs-machine-id" "none"
                  "--workspace" "/docker"]}])))

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
  [{:keys [host-dir prompts user pat]}]
  (reduce
   (partial fact-reducer host-dir)
   {}
   (->> (collect-extractors prompts)
        (map (fn [m] (merge m
                            (when user {:user user})
                            (when pat {:pat pat})))))))

(defn- get-dir
  "returns the prompt directory to use"
  [dir]
  (or
   (when (string/starts-with? dir "github") (git/prompt-dir dir))
   dir
   "docker"))

(defn get-prompts
  "run extractors and then render prompt templates
     returns ordered collection of chat messages"
  [& args]
  (let [[project-root user platform prompts-dir & {:keys [pat]}] args
        ;; TODO the docker default no longer makes sense here
        prompt-dir (get-dir prompts-dir)
        m (run-extractors
           (merge {:host-dir project-root
                   :prompts prompt-dir
                   :user user
                   :platform platform}
                  (when pat {:pat pat})))
        renderer (partial selma-render prompt-dir (facts m user platform))
        prompts (->> (fs/list-dir prompt-dir)
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
  [{:keys [functions user pat thread-volume save-thread-volume] :as opts} function-name json-arg-string {:keys [resolve fail]}]
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
                             (when pat {:pat pat})
                             (when thread-volume {:thread-volume thread-volume})
                             (when (true? save-thread-volume) {:save-thread-volume true}))
              {:keys [pty-output exit-code]} (docker/run-function function-call)]
          (if (= 0 exit-code)
            (resolve pty-output)
            (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))))
        (= "prompt" (:type definition)) ;; asynchronous call to another agent - new conversation-loop
        ;; TODO set a custom map for prompts in the next conversation loop
        (let [{:keys [messages _finish-reason] :as m}
              (async/<!! (conversation-loop
                          (:host-dir opts)
                          (:user opts)
                          (:host-dir opts)
                          (:ref definition)))]
          (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
          (resolve (->> messages
                        (filter #(= "assistant" (:role %)))
                        (last)
                        :content)))
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
  [prompts & args]
  (let [[host-dir user platform prompts-dir & {:keys [url pat save-thread-volume thread-id]}] args
        prompt-dir (get-dir prompts-dir)
        m (collect-metadata prompt-dir)
        functions (collect-functions prompt-dir)
        [c h] (openai/chunk-handler (partial
                                     function-handler
                                     (merge
                                      {:functions functions
                                       :host-dir host-dir
                                       :user user
                                       :platform platform}
                                      (when pat {:pat pat})
                                      (when save-thread-volume {:save-thread-volume true})
                                      (if thread-id 
                                        {:thread-volume thread-id}
                                        {:thread-volume (str (random-uuid))}))))]
    (try
      (openai/openai
       (merge
        {:messages prompts}
        (when (seq functions) {:tools functions})
        (when url {:url url})
        m) h)
      (catch ConnectException t
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
  [& args]
  (async/go-loop
   [thread []]
    ;; get-prompts can only use extractors - we can't refine
    ;; them based on output from function calls that the LLM plans
    (let [prompts (if (not (seq thread))
                    (apply get-prompts args)
                    thread)

          {:keys [messages finish-reason] :as m}
          (async/<!! (apply run-prompts prompts args))]
      (if (= "tool_calls" finish-reason)
        (do
          (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
          (recur (concat prompts messages)))
        (do
          (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
          {:messages (concat prompts messages) :done finish-reason})))))

(defn- -run-command
  "  returns map result"
  [& args]
  (cond
    (= "prompts" (first args))
    (concat
     [{:type "docker" :title "using docker in my project"}
      {:type "lazy_docker" :title "using lazy-docker"}
      {:type "npm_setup" :title "using npm"}]
     (->> (:prompts (git.registry/read-registry))
          (map #(assoc % :saved true))))

    (= "register" (first args))
    (if-let [{:keys [owner repo path]} (git/parse-github-ref (second args))]
      (git.registry/update-registry (fn [m]
                                      (update-in m [:prompts] (fnil conj [])
                                                 {:type (second args)
                                                  :title (format "%s %s %s"
                                                                 owner repo
                                                                 (if path (str "-> " path) ""))})))
      (throw (ex-info "Bad GitHub ref" {:ref (second args)})))

    (= "unregister" (first args))
    (git.registry/update-registry
     (fn [m]
       (update-in m [:prompts] (fn [coll] (remove (fn [{:keys [type]}] (= type (second args))) coll)))))

    (= "run" (first args))
    (select-keys
     (async/<!! (apply conversation-loop (rest args)))
     [:done])

    :else
    (apply get-prompts args)))

(def cli-opts [[nil "--jsonrpc" "Output JSON-RPC notifications"]
               [nil "--url OPENAI_COMPATIBLE_ENDPOINT" "OpenAI compatible endpoint url"]
               [nil "--user USER" "The hub user"]
               [nil "--pat PAT" "A hub PAT"]
               [nil "--host-dir DIR" "Project directory"]
               [nil "--prompts DIR_OR_GITHUB_REF" "prompts"]
               [nil "--offline" "do not try to pull new images"]
               [nil "--pretty-print-prompts" "pretty print prompts"]
               [nil "--save-thread-volume" "save the thread volume for debugging"]
               [nil "--thread-id THREAD_ID" "use this thread-id for the next conversation"]])

(defn- add-arg [options args k]
  (if-let [v (k options)] (concat args [k v]) args))

(def output-handler (fn [x] (jsonrpc/notify {:message {:content (json/generate-string x)}})))
(defn output-prompts [coll]
  (jsonrpc/notify {:message {:content "## Prompts:\n"}})
  (->> coll
       (mapcat (fn [{:keys [role content]}]
                 [(format "## %s\n" role)
                  content]))
       (interpose "\n")
       (apply str)
       ((fn [s] (jsonrpc/notify {:message {:content s}})))))

(defn -main [& args]
  (try
    (let [{:keys [arguments options]} (cli/parse-opts args cli-opts)]
      ;; positional args are
      ;;   host-project-root user platform prompt-dir-or-github-ref & {opts}
      (alter-var-root
       #'jsonrpc/notify
       (fn [_] (if (:jsonrpc options)
                 jsonrpc/-notify
                 jsonrpc/-println)))
      ((if (:pretty-print-prompts options) output-prompts output-handler)
       (apply -run-command (concat
                            arguments
                            (reduce (partial add-arg options) [] [:url :pat :host-dir :prompts])
                            (when (:offline options) [:offline true])
                            (when (:save-thread-volume options) [:save-thread-volume true])))))
    (catch Throwable t
      (warn "Error: {{ exception }}" {:exception t})
      (System/exit 1))))


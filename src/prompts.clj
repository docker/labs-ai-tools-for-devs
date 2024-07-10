(ns prompts
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [clojure.java.io :as io]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [clojure.tools.cli :as cli]
   creds
   [docker]
   [git]
   [jsonrpc]
   [markdown.core :as markdown]
   [medley.core :as medley]
   [openai]
   [pogonos.core :as stache]
   [pogonos.partials :as partials]
   [selmer.parser :as selmer]))

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

(comment
  (partials/file-partials ["dockerfiles"] ".md")
  (selma-render
   "dockerfiles"
   {}
   "dockerfiles/020_system_prompt.md"))

(def prompt-file-pattern #".*_(.*)_.*.md")

(defn- merge-role [[m f]]
  (merge m {:role (let [[_ role] (re-find prompt-file-pattern (fs/file-name f))] role)}))

(defn warn [template data]
  (binding [*out* *err*]
    (println
     (selmer/render template data))))

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
       "unable to render {{ container-definition }} - {{ exception }}"
       {:dir dir
        :container-definition container-definition
        :exception ex})
      m)))

(comment
  ;; TODO move this to an assertion
  (facts
   (fact-reducer "/Users/slim/docker/labs-make-runbook"
                 {}
                 {:image "vonwig/go-linguist:latest"
                  :command ["-json"]
                  :output-handler "linguist"
                  :user "jimclark106"
                  :pat (creds/credential-helper->jwt)})
   "jimclark106" "darwin"))

(defn collect-extractors [dir]
  (let [extractors (-> (markdown/parse-metadata (io/file dir "README.md")) first :extractors)]
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
   (map (fn [m] {:type "function" :function m}))))

(defn collect-metadata [dir]
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

;; registry of prompts directories stores in the docker-prompts volumes
(def registry-file "/prompts/registry.edn")

(defn read-registry
  "read the from the prompt registry in the current engine volume"
  []
  (try
    (edn/read-string (slurp registry-file))
    (catch java.io.FileNotFoundException _
      {:prompts []})
    (catch Throwable t
      (warn "Warning (corrupt registry.edn): {{ t }}" {:exception t})
      {:prompts []})))

(defn update-registry
  "update the prompt registry in the current engine volume"
  [f]
  (spit registry-file (pr-str (f (read-registry)))))

(defn- get-dir
  "returns the prompt directory to use"
  [dir]
  (or
   (when (string/starts-with? dir "github") (git/prompt-dir dir))
   dir
   "docker"))

(defn get-prompts [& args]
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

(defn function-handler 
  "call function
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
                                         (when (:command definition) (:command definition))
                                         (when json-arg-string [json-arg-string]))}
                             (when user {:user user})
                             (when pat {:pat pat}))
              {:keys [pty-output exit-code]} (docker/run-function function-call)]
          (if (= 0 exit-code)
            (resolve pty-output)
            (fail (format "call exited with non-zero code (%d): %s" exit-code pty-output))))
        (= "prompt" (:type definition)) ;; asynchronous call to another agent
        (do
          ;; TODO use the assistant here
          (resolve "This is an NPM project.")))
      (catch Throwable t
        (fail (format "system failure %s" t))))
    (fail "no function found")))

(defn- run-prompts
  [prompts & args]
  (let [[host-dir user platform prompts-dir & {:keys [pat]}] args
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
                                      (when pat {:pat pat}))))]

    (openai/openai
     (merge
      {:messages prompts}
      (when (seq functions) {:tools functions})
      m) h)
    c))

(defn- conversation-loop
  [& args]
  (async/go-loop
   [prompts (apply get-prompts args)]
    (let [{:keys [messages finish-reason] :as m} (async/<!! (apply run-prompts prompts args))]
      (if (= "tool_calls" finish-reason)
        (do
          (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
          (recur (concat prompts messages)))
        (do
          (jsonrpc/notify :message {:debug (with-out-str (pprint m))})
          {:done finish-reason})))))

(defn- -run-command
  [& args]
  (cond
    (= "prompts" (first args))
    (concat
     [{:type "docker" :title "using docker in my project"}
      {:type "lazy_docker" :title "using lazy-docker"}
      {:type "npm_setup" :title "using npm"}]
     (->> (:prompts (read-registry))
          (map #(assoc % :saved true))))

    (= "register" (first args))
    (if-let [{:keys [owner repo path]} (git/parse-github-ref (second args))]
      (update-registry (fn [m]
                         (update-in m [:prompts] (fnil conj [])
                                    {:type (second args)
                                     :title (format "%s %s %s"
                                                    owner repo
                                                    (if path (str "-> " path) ""))})))
      (throw (ex-info "Bad GitHub ref" {:ref (second args)})))

    (= "unregister" (first args))
    (update-registry
     (fn [m]
       (update-in m [:prompts] (fn [coll] (remove (fn [{:keys [type]}] (= type (second args))) coll)))))

    (= "run" (first args))
    (async/<!! (apply conversation-loop (rest args)))

    :else
    (apply get-prompts args)))

(defn prompts [& args]
  (println
   (json/generate-string (apply -run-command args))))

(def cli-opts [[nil "--jsonrpc" "Output JSON-RPC notifications"]
               [nil "--user USER" "The hub user"]
               [nil "--pat PAT" "A hub PAT"]])

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
      (apply prompts (concat
                      arguments
                      (when-let [pat (:pat options)] [:pat pat]))))
    (catch Throwable t
      (warn "Error: {{ exception }}" {:exception t})
      (System/exit 1))))


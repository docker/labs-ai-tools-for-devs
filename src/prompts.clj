(ns prompts
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.java.io :as io]
   [clojure.string :as string]
   creds
   [docker]
   [git]
   [git.registry]
   [jsonrpc]
   logging
   [markdown :as markdown-parser]
   [markdown.core :as markdown]
   [medley.core :as medley]
   [openai]
   [pogonos.core :as stache]
   [pogonos.partials :as partials]
   [registry]))

(set! *warn-on-reflection* true)

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
    returns collection of openai compatible tool definitions augmented with container info"
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


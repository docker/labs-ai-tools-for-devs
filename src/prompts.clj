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
   [medley.core :as medley]
   [openai]
   [pogonos.core :as stache]
   [pogonos.partials :as partials]
   [registry]
   [selmer.parser :as selmer]
   schema))

(set! *warn-on-reflection* true)

(defn- facts
  "fix up facts before sending to templates"
  [project-facts user platform host-dir]
  (medley/deep-merge
   {:platform platform
    :username user
    :hostDir host-dir
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
     (let [{:keys [pty-output exit-code]} (docker/run-container
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
             (if (map? context) context {(or (keyword (:output-handler container-definition)) :extractor) context}))))))
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

(def hub-images
  #{"curl" "qrencode" "toilet" "figlet" "gh" "typos" "fzf" "jq" "fmpeg" "pylint" "imagemagick" "graphviz"})

(defn function-definition [m]
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
      (medley/deep-merge
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
    [{:type "function" :function (merge (registry/get-function m) (dissoc m :image))}]))

(defn run-extractors
  "returns a map of extracted *math-context*
     params
       project-root - the host project root dir
       identity-token - a valid Docker login auth token
       dir - a prompts directory with a valid README.md"
  [extractors {:keys [host-dir user jwt]}]
  (reduce
   (partial fact-reducer host-dir)
   {}
   (->> extractors
        (map (fn [m] (merge (registry/get-extractor m) m)))
        (map (fn [m] (merge m
                            (when user {:user user})
                            (when jwt {:jwt jwt})))))))

(defn- moustache-render [prompts-file m message]
  (update message
          :content
          (fn [content]
            (if prompts-file
              (stache/render-string
               content
               m
               {:partials (partials/file-partials
                           [(if (fs/directory? prompts-file) prompts-file (fs/parent prompts-file))]
                           ".md")})
              (stache/render-string content m)))))

(defn selmer-render [m message]
  (update message
          :content
          (fn [content]
            (selmer/render content m))))

(selmer/add-tag! :tip (fn [args context-map]
                        (format
                         "At the very end of the response, add this sentence: \"ℹ️ You can also ask: '%s'\", in the language used by the user, with the question in italic." (first args))))

(comment
  (stache/render-string "yo {{a.0.content}}" {:a [{:content "blah"}]}))

(def prompt-file-pattern #".*_(.*)_.*.md")

(defn ->message [{:keys [content] :as m}] (assoc m :content {:text content :type "text"}))

(defn get-prompts
  "run extractors and then render prompt templates (possibly)
     parameters
       mandatory
         either prompts or prompt-content
           prompts should be a markdown file
           prompts used to be a directory but that's deprecated
       optional
         user, platform, host-dir - create default facts for template rendering]
         parameters - external params bound at rendering time
       
     returns a :schema/prompts-file"
  [{:keys [parameters prompts user platform host-dir prompt-content] :as opts}]
  (let [{:keys [metadata] :as prompt-data}
        (cond
          ;; prompt content is already in opts
          prompt-content
          (markdown-parser/parse-prompts prompt-content)

          ;; file based prompts
          :else
          (markdown-parser/parse-prompts (slurp prompts)))

        m (merge
           (run-extractors (:extractors metadata) opts)
           parameters
           (-> metadata :parameter-values))
        renderer (if (= "django" (:prompt-format metadata))
                   (fn [arguments message]
                     (selmer-render (merge (facts m user platform host-dir) arguments) message))
                   (fn [arguments message]
                     (moustache-render prompts (merge (facts m user platform host-dir) arguments) message)))]
    ((schema/validate :schema/prompts-file)
     (-> prompt-data
         (assoc :mcp/prompt-registry
                (->> (:messages prompt-data)
                     (map (fn [{:keys [name] :as v}]
                            [name (assoc
                                   (select-keys v [:description])
                                   :prompt-function
                                   (fn [arguments]
                                     [((comp ->message (partial renderer arguments))
                                       (select-keys v [:role :content]))]))]))
                     (into {})))
         (update :messages (fn [messages]
                             (->> messages
                                  (map (partial renderer {}))
                                  (map #(dissoc % :title)))))
         (update :metadata dissoc :functions :tools :extractors)
         (assoc :functions (->> (or (:tools metadata) (:functions metadata)) (mapcat function-definition)))))))

(comment
  (get-prompts {:prompts (fs/file "./prompts/examples/curl.md")})
  (get-prompts {:prompts (fs/file "./prompts/examples/generate-dockerfile.md")})
  (get-prompts {:prompts (fs/file "./README.md")})
  (=
   ((:prompt-function (get-prompts {:prompts (fs/file "./prompts/examples/qrencode.md")})) {:content "mycontent"})
   [{:role "user",
     :content
     {:text
      "\nGenerate a QR code for the content 'mycontent'.\nSave the generated image to `/thread/resources/qrcode.png`.\nIf the command fails, read the man page and try again.\nIf successful, output the path to the generated image in markdown syntax.",
      :type "text"}}]))


(ns catalog
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clj-yaml.core :as yaml]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [flatland.ordered.map :refer [ordered-map]]
   [git]
   [markdown :as markdown-parser]
   [mcp.client :as client]
   [medley.core :as medley]
   [prompts]
   [repl]))

(defn mcp-metadata-cache [f]
  (edn/read-string
   {:readers {'ordered/map (fn [pairs] (into (ordered-map pairs)))}}
   (slurp f)))

(comment
  (mcp-metadata-cache "test/resources/mcp-metadata-cache.edn"))

(defn prompt-metadata [s]
  (try
    (prompts/get-prompts {:prompts (fs/file s)})
    (catch Throwable t
      (println t))))

(defn f->prompt [f]
  (try (prompts/read-prompts {:prompts f}) (catch Throwable t (println t) {})))

(defn tile-metadata [m]
  {:tools (->> (:functions m)
               (map #(select-keys [:name] (:function %)))
               (into []))
   :prompts (count (:messages m))
   :resources (or (:resources m) {})})

(defn extra-metadata [vals]
  (->> vals
       (map :ref)
       (map git/prompt-file)
       (map f->prompt)
       (map tile-metadata)))

(defn generate-updated-catalog []
  (spit "catalog.updated.yaml"
        (yaml/generate-string
         (let [catalog (yaml/parse-string (slurp "prompts/catalog.yaml"))]
           (medley/deep-merge
            catalog
            {:registry
             (->> (apply interleave ((juxt keys (comp extra-metadata vals)) (seq (:registry catalog))))
                  (partition 2)
                  (map #(into [] %))
                  (into {}))})))))

(defn secrets [prompt]
  (cond
    (-> prompt :metadata :mcp)
    (->> (-> prompt :metadata :mcp)
         (map (fn [m] m))
         (into []))
    (-> prompt :functions)
    (->> (-> prompt :functions)
         (map (fn [m] (select-keys (:function m) [:container :secrets :source])))
         (into []))
    :else []))

(comment
  ;; setup stdout logger
  (repl/setup-stdout-logger)
  (generate-updated-catalog)
  ;; parse catalog
  (def catalog (yaml/parse-string (slurp "prompts/catalog.yaml")))
  (spit "servers.edn" (pr-str (into [] (map name (keys (:registry catalog))))))
  (string/join "," (->> (:registry catalog) keys (map name)))

  (->> (-> catalog :registry vals)
       (map :config)
       (filter seq)
       count)

  (def prompt-ref-strings
    (->> catalog
         :registry
         vals
         (map :ref)))

  ;; raw github urls (map to other branches if checking a merge)
  (def prompt-refs
    (->> catalog
         :registry
         vals
         (map :ref)
         (map (fn [ref-string] (assoc (git/parse-github-ref ref-string) :ref-string ref-string)))))

  ;; current git ref files
  (def local-prompt-files
    (->> prompt-refs
         (map (fn [k] {:ref k
                       :file (if (not (:owner k))
                               (fs/file (:path k))
                               (git/ref-map->prompt-file k))}))))

  (f->prompt (fs/file "prompts/mcp/notion.md"))
  (f->prompt (fs/file "prompts/mcp/multiversx-mx.md"))
  (f->prompt (fs/file "prompts/mcp/elasticsearch.md"))

  ;; parse all of the current git prompts
  (def local-prompt-files-parsed
    (map (fn [m] (-> m (assoc :prompt (f->prompt (:file m))))) local-prompt-files))

  (filter #(= "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/mcp/elasticsearch.md" (-> % :ref :ref-string))  local-prompt-files-parsed)

  ;; make sure prompts are present - should be empty
  (->> local-prompt-files-parsed
       (filter (complement #(seq (:prompt %)))))

  ;; extract secrets, source and container image info
  (def container-summary
    (->> local-prompt-files-parsed
         (map (fn [m] [(-> m :ref :ref-string) (secrets (:prompt m))]))
         (into {})))

  (first local-prompt-files-parsed)
  (def volume-summary
    (->> local-prompt-files-parsed
         (filter #(or (->> % :prompt :metadata :mcp (some (fn [x] (-> x :container :volumes))))
                      (->> % :prompt :functions (some (fn [x] (-> x :function :container :volumes))))))
         (map (fn [m] [(-> m :ref :ref-string)
                       (->> m :prompt ((fn [prompt]
                                          (cond
                                            (-> prompt :metadata :mcp) (->> prompt
                                                                            :metadata
                                                                            :mcp
                                                                            (map (fn [x] (-> x :container :volumes))))
                                            (-> prompt :functions) (->> prompt
                                                                        :functions
                                                                        (map (fn [x] (-> x :function :container :volumes))))))))]))
         (into {})))

  ;; secret summary
  (def secrets
    (->> container-summary
         vals
         (mapcat #(->> % (map (comp :secrets :container))))
         (filter seq)))

  (->> secrets
       (mapcat keys)
       (map name)
       (string/join ","))

;; summary
  (->> container-summary
       (mapcat (fn [[k v]] (->> v (map (fn [m]
                                         {:image (-> m :container :image)
                                          :source (-> m :source :url)
                                          :ref k}))))))

  (def all-images
    (->>
     (concat
      (->> (into {} all-prompt-files)
           (vals)
           (mapcat (comp :mcp :metadata))
           (map (comp :image :container))
           (into #{}))
      (->> (into {} all-prompt-files)
           (vals)
           (mapcat :functions)
           (map (comp :image :container :function))
           (into #{})))
     (into #{})
     (sort)))

;;
  (markdown-parser/parse-markdown (slurp "prompts/examples/sequentialthinking.md")))

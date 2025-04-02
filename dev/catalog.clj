(ns catalog
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clj-yaml.core :as yaml]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [flatland.ordered.map :refer [ordered-map]]
   git
   [markdown :as markdown-parser]
   [mcp.client :as client]
   [medley.core :as medley]
   prompts
   repl))

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
  (try (prompts/get-prompts {:prompts f}) (catch Throwable t (println t) {})))

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

(comment
  ;; setup stdout logger
  (repl/setup-stdout-logger)
  (generate-updated-catalog)
  ;; parse catalog
  (def catalog (yaml/parse-string (slurp "prompts/catalog.yaml")))
  (count (:registry catalog))
  (string/join "," (->> (:registry catalog) keys (map name)))

  ;; raw github urls to
  (def prompt-refs
    (->> catalog
         :registry
         vals
         (map :ref)
         (map #(git/parse-github-ref %))
         (map #(format "https://raw.githubusercontent.com/%s/%s/refs/heads/%s/%s" (:owner %) (:repo %) (or (:ref %) "main") (:path %)))))

  (->> prompt-refs (interpose "\n") (apply str) (println))

  (def prompt-refs
    (->> catalog
         :registry
         vals
         (map :ref)
         (map #(git/parse-github-ref %))
         (map #(format "https://raw.githubusercontent.com/%s/%s/refs/heads/%s/%s" (:owner %) (:repo %) (or (:ref %) "main") (:path %)))))

 (->> prompt-refs (interpose "\n") (apply str) (println)) 

  ;; current git ref files
  (def local-prompt-files
    (->> catalog
         :registry
         vals
         (map :ref)
         (map #(conj [%] (git/prompt-file %)))
         (into {})))
  

;; parse all of the current git prompts
  (with-redefs [client/get-mcp-tools-from-prompt (constantly [])]
    (def all-prompt-files (map (fn [[k v]] [k (f->prompt v)]) local-prompt-files)))

  (pprint (->> all-prompt-files
               (map (fn [[k v]] [k (dissoc v :mcp/resources)]))
               (into {})))
  (spit "crap.json" (json/generate-string
                     (->> all-prompt-files
                          (map (fn [[k v]] [k (dissoc v :mcp/resources :mcp/prompt-registry)]))
                          (into {}))
                     {:pretty true}))

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

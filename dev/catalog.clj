(ns catalog
  (:require
   [babashka.fs :as fs]
   [clj-yaml.core :as yaml]
   git
   repl
   [markdown :as markdown-parser]
   [medley.core :as medley]
   prompts))

(defn prompt-metadata [s]
  (try
    (prompts/get-prompts {:prompts (fs/file s)})
    (catch Throwable t
      (println t))))

(defn f->prompt [f]
  (prompts/get-prompts {:prompts f}))

(defn tile-metadata [m]
  {:tools (-> m :functions)
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

  ;; parse catalog
  (def catalog (yaml/parse-string (slurp "prompts/catalog.yaml")))

  ;; current git ref files
  (def local-prompt-files
    (->> catalog
         :registry
         vals
         (map :ref)
         (map git/prompt-file)))

  ;; parse all of the current git prompts
  (map f->prompt local-prompt-files)

  ;;
  (markdown-parser/parse-markdown (slurp "prompts/examples/sequentialthinking.md")))

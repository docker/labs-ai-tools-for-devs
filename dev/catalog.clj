(ns catalog
  (:require
   [babashka.fs :as fs]
   [clj-yaml.core :as yaml]
   git
   [markdown :as markdown-parser]
   [medley.core :as medley]
   prompts))

(try
  (prompts/get-prompts {:prompts (fs/file "prompts/chrome.md")})
  (catch Throwable t
    (println t)))

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

(spit "catalog.updated.yaml"
      (yaml/generate-string
       (let [catalog (yaml/parse-string (slurp "prompts/catalog.yaml"))]
         (medley/deep-merge
          catalog
          {:registry
           (->> (apply interleave ((juxt keys (comp extra-metadata vals)) (seq (:registry catalog))))
                (partition 2)
                (map #(into [] %))
                (into {}))}))))

(def catalog (yaml/parse-string (slurp "prompts/catalog.yaml")))
(def local-prompt-files
  (->> catalog
       :registry
       vals
       (map :ref)
       (map git/prompt-file)))

(map f->prompt local-prompt-files)

(markdown-parser/parse-markdown (slurp "prompts/examples/sequentialthinking.md"))
(prompts/get-prompts {:prompt-content (slurp "prompts/examples/sequentialthinking.md")})

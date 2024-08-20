(ns clean-local-images
  (:require [docker]
            [clojure.pprint :refer [pprint]]))

(def images
  #{"vonwig/prompts:latest"
    "vonwig/github-cli"
    "vonwig/function_write_file"
    "vonwig/docker_scout_tag_recommendation"
    "vonwig/extractor-node"
    "vonwig/go-linguist"
    "vonwig/codescope"
    "vonwig/pre-commit"
    "markdownlint/markdownlint"
    "hadolint/hadolint"
    "vonwig/fasttext"
    "vonwig/typos"
    "vonwig/what-is-my-ip"
    "vonwig/findutils"
    "vonwig/qrencode"
    "vonwig/curl"
    "vonwig/standardjs"
    "vonwig/eslint"
    "vonwig/git"
    "vonwig/clj-kondo"
    "vonwig/extractor-eslint"})

(comment
  (docker/delete-image {:image "vonwig/function_write_files"}))

(defn repo? [images]
  (fn [tag-or-digest]
    (some (fn [image] (.startsWith tag-or-digest image)) images)))

(defn -main []
  (println
    (->> (docker/images {})
         #_(map #(concat (:RepoTags %) (:RepoDigests %)))
         (filter #(some (repo? images) (concat (:RepoTags %) (:RepoDigests %))))
         (map :Id)
         (map #(docker/delete-image {:image %})))))

(comment
  (pprint (docker/images {}))
  )


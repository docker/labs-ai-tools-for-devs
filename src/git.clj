(ns git
  (:require [clojure.string :as string]
            [babashka.process :as p]
            [babashka.fs :as fs]
            [hasch.core :as hasch]))

(def github-ref-pattern #"github:(.*)/(.*)")

(comment
  (re-find github-ref-pattern "github:docker/labs-make-runbook")
  (re-find github-ref-pattern "github:docker/labs-make-runbook?hey"))

(defn- reduce-attribute [m s]
  (if-let [[k v] (string/split s #"=")]
    (assoc m (keyword k) v)
    m))

(defn- split-opts [ref]
  (string/split ref #"\?"))

(defn- parse-ref [[ref opts]]
  (when-let [[_ owner repo] (re-find github-ref-pattern ref)]
    [{:owner owner :repo repo} opts]))

(defn- add-attributes [[m opts]]
  (if opts
    (reduce reduce-attribute m (string/split opts #"&"))
    m))

(defn parse-github-ref [ref]
  (some-> ref
          split-opts
          parse-ref
          add-attributes))

(defn- hashch
  "returns #uuid"
  [m]
  (str (hasch/uuid5 (hasch/edn-hash (select-keys m [:owner :repo :ref])))))

(comment
  (hashch {:owner "docker" :repo "labs-make-runbook"})
  (hashch {:owner "docker" :repo "labs-make-runbook" :ref "main"}))

;(def prompts-cache (fs/file "/Users/slim/docker/labs-make-runbook/prompts-cache"))
(def prompts-cache (fs/file "/prompts"))

(defn prompt-dir 
  "returns the path or nil if the github ref does not resolve
   throws if the path in the repo does not exist or if the clone fails"
  [ref]
  (when-let [{:keys [owner repo ref path] :as git-ref-map} (parse-github-ref ref)]
    (let [ref-hash (hashch (select-keys git-ref-map [:owner :repo :ref]))
          dir (fs/file prompts-cache ref-hash)
          _ (if (fs/exists? dir)
              (-> (apply p/process 
                         {:dir dir} 
                         (concat
                           ["git" "pull" "origin"]
                           (when ref [ref])))
                  (deref))
              (-> (apply p/process
                         {:dir (fs/parent dir)}
                         (concat
                          ["git" "clone" "--depth" "1" (format "https://github.com/%s/%s" owner repo)]
                          (when ref ["-b" ref])
                          [ref-hash]))
                  (deref)
                  (p/check)))]
      (if path
        (let [cached-path (fs/file dir path)]
          (if (fs/exists? cached-path)
            cached-path
            (throw (ex-info "repo exists but path does not" ref))))
        dir))))

(comment
  (fs/create-dir prompts-cache)
  (def x "github:docker/labs-make-runbook?ref=main&path=prompts/docker")
  (def git-ref (parse-github-ref x))
  (prompt-dir "github:docker/labs-make-runbook?ref=main&path=prompts/docker")
  (parse-github-ref nil)
  (parse-github-ref "")
  (parse-github-ref "github:docker/labs-make-runbook")
  (parse-github-ref "github:docker/labs-make-runbook?ref=main&path=/prompts/docker")
  (parse-github-ref "github:docker/labs-githooks?ref=main&path=/prompts/docker")
  )

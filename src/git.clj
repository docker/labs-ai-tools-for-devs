(ns git
  (:require
   [babashka.fs :as fs]
   [clojure.string :as string]
   dir
   docker
   [hasch.core :as hasch]
   jsonrpc))

(set! *warn-on-reflection* true)

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

(defn hashch
  "returns #uuid"
  [m]
  (str (hasch/uuid5 (hasch/edn-hash (select-keys m [:owner :repo :ref])))))

;(def prompts-cache (fs/file "/Users/slim/docker/labs-make-runbook/prompts-cache"))
(defn prompts-cache []
  (let [default-dir (fs/file (System/getenv "HOME") ".prompts-cache")]
    (or
     (dir/get-dir "/prompts" default-dir)
     (do
       (fs/create-dirs default-dir)
       default-dir))))

(comment
  "alpine/git uses a VOLUME /git declaration
   so we need to mount something there or docker will create
   a volume.
   https://docs.docker.com/reference/dockerfile/#volume
   see https://hub.docker.com/r/alpine/git for usage guidelines")

(defn pull [{:keys [dir ref]}]
  (docker/run-container
   (merge
    {:image "alpine/git:latest"
     :command (concat ["pull" "origin"]
                      (when ref [ref]))}
    (if (string/starts-with? (str dir) "/prompts")
      {:workdir (str dir)
       :volumes ["docker-prompts-git:/git"
                 "docker-prompts:/prompts:rw"]}
      {:host-dir (str dir)
       :volumes ["docker-prompts-git:/git"]}))))

(defn clone [{:keys [dir owner repo ref ref-hash]}]
  (docker/run-container
   (merge
    {:image "alpine/git:latest"}
    (if (string/starts-with? (str dir) "/prompts")
      {:workdir (str dir)
       :volumes ["docker-prompts-git:/git"
                 "docker-prompts:/prompts:rw"]
       :command (concat ["clone" "--depth" "1" (format "https://github.com/%s/%s" owner repo)]
                        (when ref ["-b" ref])
                        [(format "/prompts/%s" ref-hash)])}
      {:host-dir (str dir)
       :volumes ["docker-prompts-git:/git"]
       :command (concat ["clone" "--depth" "1" (format "https://github.com/%s/%s" owner repo)]
                        (when ref ["-b" ref])
                        [(format "/project/%s" ref-hash)])}))))

(comment
  (clone {:dir "/Users/slim/crap" :owner "docker" :repo "labs-make-runbook" :ref "main" :ref-hash "crap"}))

(defn cache-dir [{:keys [ref-hash]}]
  (fs/file (prompts-cache) ref-hash))

(defn collect-unique-cache-dirs [coll]
  (->> coll
       (sort-by (comp :ref-hash :ref))
       (partition-by (comp :ref-hash :ref))
       (map first)))

(defn refresh-cache
  " pure side-effect - clone or pull the cache"
  [coll]
  (doseq [m coll]
    (let [c (if (fs/exists? (-> m :ref :dir))
              (pull (:ref m))
              (clone (:ref m)))]
      (when (not (= 0 (:exit-code c)))
        (jsonrpc/notify :error {:content (str c)})))))

(defn cached-prompt-file [{{:keys [dir path]} :ref :as m}]
  (if path
    (let [cached-path (fs/file dir path)]
      (if (fs/exists? cached-path)
        (assoc m :cached-path cached-path)
        m))
    m))

(defn prompt-file
  "returns the path or nil if the github ref does not resolve
   throws if the path in the repo does not exist or if the clone fails"
  [ref]
  (when-let [{:keys [ref path] :as git-ref-map} (parse-github-ref ref)]
    (let [ref-hash (hashch (select-keys git-ref-map [:owner :repo :ref]))
          dir (cache-dir {:ref-hash ref-hash})
          m (if (fs/exists? dir)
              (pull {:dir dir :ref ref})
              (clone (merge git-ref-map {:dir (fs/parent dir) :ref-hash ref-hash})))]
      (when (not (= 0 (:exit-code m)))
        (jsonrpc/notify :error {:content (str m)}))
      (if path
        (let [cached-path (fs/file dir path)]
          (if (fs/exists? cached-path)
            cached-path
            (throw (ex-info "repo exists but path does not" {:ref ref}))))
        dir))))

(comment
  (prompt-file "github:docker/labs-make-runbook?path=prompts/docker/prompt.md"))

(comment
  (fs/create-dir (prompts-cache))
  (def x "github:docker/labs-make-runbook?ref=main&path=prompts/docker")
  (def git-ref (parse-github-ref x))
  (prompt-file "github:docker/labs-make-runbook?ref=main&path=prompts/docker")
  (parse-github-ref nil)
  (parse-github-ref "")
  (parse-github-ref "github:docker/labs-make-runbook")
  (parse-github-ref "github:docker/labs-make-runbook?ref=main&path=/prompts/docker")
  (parse-github-ref "github:docker/labs-githooks?ref=main&path=/prompts/docker"))

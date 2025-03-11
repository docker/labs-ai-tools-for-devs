(ns jsonrpc.db
  (:require
   [clj-yaml.core :as yaml]
   [clojure.pprint :refer [pprint]]
   git
   [jsonrpc.logger :as logger]
   [medley.core :as medley]
   prompts
   prompts.core
   repl))

(set! *warn-on-reflection* true)

(def db* (atom {}))

(defn- get-prompt-data
  "get map of prompt data from a set of prompt files
     params
       register is a coll of prompt file ref maps"
  [{:keys [register] :as opts}]
  (->> register
       (map (fn [{:keys [cached-path ref-string config] :as registration-entry}]
              (logger/info registration-entry)
              (try
                (let [m (prompts/get-prompts (-> opts
                                                 (assoc :config config)
                                                 (assoc :prompts cached-path)))]
                  [(or (-> m :metadata :name) ref-string)
                   m])
                (catch Throwable t
                  (logger/error (format "error loading %s: %s" ref-string t))))))
       (into {})))

(defn- extract-resources
  "extract resource map from a prompt"
  [m]
  (->> (vals m)
       (map (comp :resources :metadata))
       (filter identity)
       (map (fn [{:keys [uri] :as entry}]
              [uri (merge
                    entry
                    (when (and (not (contains? entry :text)) (-> entry :default :text))
                      {:text (-> entry :default :text)}))]))
       (into {})))

(defn- add-static-prompts
  [db m]
  (-> db
      (update :mcp.prompts/registry (fnil merge {}) m)
      (assoc :mcp.prompts/static m)
      (update :mcp.prompts/resources (fnil merge {}) (extract-resources m))))

(defn- add-dynamic-prompts [db m]
  (logger/info "dynamic keys" (keys (:mcp.prompts/registry db)))
  (logger/info "static keys" (keys (:mcp.prompts/static db)))
  (-> db
      (assoc :mcp.prompts/registry (merge m (:mcp.prompts/static db)))
      (update :mcp.prompts/resources (fnil merge {}) (extract-resources m))))

(defn- update-dynamic [coll]
  (swap! db* add-dynamic-prompts (get-prompt-data {:register coll})))
(defn- update-static [coll]
  (swap! db* add-static-prompts (get-prompt-data {:register coll})))

(defn- missing-cached-prompt-file? [m]
  (when (not (contains? m :cached-path))
    (logger/warn (format "missing cached path: %s" (:ref-string m)))
    m))

(defn git-cache-refs [refs]
  (->> refs
       (map (fn [{:keys [ref] :as v}] (assoc v :ref-string ref :ref (git/parse-github-ref ref))))
       (map (fn [m] (assoc-in m [:ref :ref-hash] (git/hashch (:ref m)))))
       (map (fn [m] (assoc-in m [:ref :dir] (git/cache-dir (:ref m)))))))

(defn add-refs
  "update the db with new refs after rereshing the cache from git
     params
       refs - collection of registry maps with s/keys :type :ref"
  [refs]
  (if (seq refs)
    ;; turn static/dynamic refs into maps of type, ref-string, and parsed ref with cache dir
    (let [git-map-coll (git-cache-refs refs)]
      ;; refresh cache (side effect)
      (-> git-map-coll
          git/collect-unique-cache-dirs
          git/refresh-cache)
      ;; updated git map with cached-path
      (let [typed-colls
            (->> git-map-coll
                 (map git/cached-prompt-file)
                 (filter (complement missing-cached-prompt-file?))
                 (sort-by :type)
                 (partition-by :type))]
        (doseq [coll typed-colls]
          (case (-> coll first :type)
            :dynamic (update-dynamic coll)
            :static (update-static coll)
            (logger/info "unknown type " (first coll))))))
    ;; if registry.yaml is empty
    (swap! db* (fn [db] (-> db
                            (update
                             :mcp.prompts/registry
                             (constantly (or (:mcp.prompts/static db) {})))))))
  (logger/info "resources are " (:mcp.prompts/resources @db*)))

(defn update-prompt
  "update the db with new markdown prompt content being dynamically registered"
  [opts s content]
  (let [m (prompts/get-prompts
           (assoc opts :prompt-content content))]
    (swap! db* (fn [db]
                 (-> db
                     (update-in [:mcp.prompts/registry s] (constantly m))
                     (update-in [:mcp.prompts/static s] (constantly m))
                     (update [:mcp.prompts/resources] (fnil merge {}) (extract-resources m)))))))

(comment
  (println @db*)
  (-> @db* :mcp.prompts/registry (get "github-issues"))
  (update-prompt {} "github-issues" (slurp "prompts/examples/github_issues.md")))

;; the registry.yaml file is a list of refs selected from our catalog
(defn registry-refs
  "parse refs from the registry.yaml file - these are dynamic"
  [f]
  (->>
   (yaml/parse-string (slurp f))
   :registry
   (vals)
   (map (fn [m] (assoc m :type :dynamic)))))

(comment
  (repl/setup-stdout-logger)
  ; in /$HOME/registry.yaml
  (git/collect-unique-cache-dirs
    (git-cache-refs
      (registry-refs prompts.core/registry)))
  
  ; prompts will come from prompts-cache
  ;   /prompts or $HOME/.prompts-cache
  (git/hashch {:owner "docker" :repo "labs-ai-tools-for-devs" :ref "slim/config"})
  (add-refs (registry-refs prompts.core/registry))
  (-> @db*
      :mcp.prompts/registry
      pprint))

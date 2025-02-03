(ns jsonrpc.db
  (:require
   [clj-yaml.core :as yaml]
   git
   [jsonrpc.logger :as logger]
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [register] :as opts}]
  (->> register
       (map (fn [{:keys [cached-path]}]
              (let [m (prompts/get-prompts (assoc opts :prompts cached-path))]
                [(or (-> m :metadata :name) ref) m])))
       (into {})))

(defn add-static-prompts [db m]
  (-> db
      (update :mcp.prompts/registry (fnil merge {}) m)
      (assoc :mcp.prompts/static m)))

(defn add-dynamic-prompts [db m]
  (logger/info "dynamic keys" (keys (:mcp.prompts/registry db)))
  (logger/info "static keys" (keys (:mcp.prompts/static db)))
  (-> db
      (assoc :mcp.prompts/registry (merge m (:mcp.prompts/static db)))))

(defn update-dynamic [coll]
  (swap! db* add-dynamic-prompts (get-prompt-data {:register coll})))
(defn update-static [coll]
  (swap! db* add-static-prompts (get-prompt-data {:register coll})))

(defn missing-cached-prompt-file? [m]
  (when (not (contains? m :cached-path))
    (logger/warn "missing cached path: %s" (:ref-string m))
    m))

(defn add-refs
  "update the db with new refs
     params
       refs - coll of [type ref] type is static or dynamic"
  [refs]
  (if (seq refs)
    (let [git-map-coll (->> refs
                            (map (fn [[t ref]] {:type t :ref-string ref :ref (git/parse-github-ref ref)}))
                            (map (fn [m] (assoc-in m [:ref :ref-hash] (git/hashch (:ref m)))))
                            (map (fn [m] (assoc-in m [:ref :dir] (git/cache-dir (:ref m))))))]
      (-> git-map-coll
          git/collect-unique-cache-dirs
          git/refresh-cache)
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
                              (constantly (or (:mcp.prompts/static db) {}))))))))

(defn registry-refs 
  "parse refs from the registry.yaml file - these are dynamic"
  [f]
  (->>
   (yaml/parse-string (slurp f))
   :registry
   (vals)
   (map (fn [{:keys [ref]}] [:dynamic ref]))))


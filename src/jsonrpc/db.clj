(ns jsonrpc.db
  (:require
   [clj-yaml.core :as yaml]
   git
   [jsonrpc.logger :as logger]
   prompts))

(def db* (atom {}))

(defn get-prompt-data [{:keys [register] :as opts}]
  (logger/info "get-prompt-data " register)
  (->> register
       (map (fn [ref] [ref (git/prompt-file ref)]))
       (map (fn [[ref f]]
              (let [m (prompts/get-prompts (assoc opts :prompts f))]
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

(defn add
  "add any static prompts to db"
  [opts]
  (logger/info "adding static prompts" (:register opts))
  (let [prompt-registry (get-prompt-data opts)]
    (swap! db* add-static-prompts prompt-registry)))

(comment
  (add {:register ["github:docker/labs-ai-tools-for-devs?path=prompts/examples/explain_dockerfile.md"
                   "github:docker/labs-ai-tools-for-devs?path=prompts/examples/hello_world.md"]}))

(defn merge [{:keys [registry-content] :as opts}]
  (logger/info "adding dynamic prompts" registry-content)
  (try
    (let [{:keys [registry]} (yaml/parse-string registry-content)
          prompt-registry (get-prompt-data (assoc opts :register (map :ref (vals registry))))]
      (logger/info "merging" prompt-registry)
      (swap! db* add-dynamic-prompts prompt-registry))
    (catch Throwable e
      (logger/error e "could not merge dynamic prompts"))))

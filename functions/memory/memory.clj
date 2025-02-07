(ns memory
  (:require
   [cheshire.core :as json]
   [clojure.java.io :as io]
   [clojure.string :as string]))

(def db-file "/memory/memory.json")

(defn- item [graph item]
  (let [{:keys [type] :as m} (json/parse-string item keyword)]
    (case type
      "entity" (update graph :entities (fnil conj []) m)
      "relation" (update graph :relations (fnil conj []) m))))

(defn- load-graph []
  (try
    (->> (line-seq (io/reader db-file))
         (reduce item {}))
    (catch Throwable _
      {:entities []
       :relations []})))

(defn- save-graph [graph]
  (spit
   db-file
   (->>
    (concat
     (->> (:entities graph)
          (map #(assoc % :type "entity"))
          (map json/generate-string))
     (->> (:relations graph)
          (map #(assoc % :type "relation"))
          (map json/generate-string)))
    (string/join "\n"))))

(defn- entity-in-graph? [graph e]
  (some #(= (:name e) (:name %)) (:entities graph)))

;; must have names
(defn create-entities [{:keys [entities]}]
  (let [graph (load-graph)
        new-entities (->> entities
                          (filter
                           (complement (partial entity-in-graph? graph))))]
    (save-graph (update graph :entities concat new-entities))
    (json/generate-string new-entities)))

(defn- relation-in-graph? [graph e]
  (some
   #(and
     (= (:from e) (:from %))
     (= (:to e) (:to %))
     (= (:relationType e) (:relationType %)))
   (:relations graph)))

;; must have from, to, and relationType
(defn create-relations [{:keys [relations]}]
  (let [graph (load-graph)
        new-relations (->> relations
                           (filter
                            (complement
                             (partial relation-in-graph? graph))))]
    (save-graph (update graph :relations (fnil concat []) new-relations))
    (json/generate-string new-relations)))

(defn- add-observation [agg {:keys [entityName contents]}]
  (if-let [[n entity] (some
                       (fn [[_ m :as v]] (when (= entityName (:name m)) v))
                       (->> (-> agg :graph :entities)
                            (interleave (range))
                            (partition 2)))]
    (let [new-observations (->> contents
                                (filter (complement #(some (partial = %) (:observations entity)))))]
      (-> agg
          (update :results conj {:entityName entityName :addedObservations new-observations})
          (update :graph update-in [:entities n :observations] (fnil concat []) new-observations)))
    (throw (ex-info (format "Entity with name %s not found" entityName) {}))))

;; observations are a list of entityName contents maps - contents are string arrays
(defn add-observations [{:keys [observations]}]
  (let [graph (load-graph)
        {:keys [results graph]} (->> observations
                                     (reduce
                                      add-observation
                                      {:graph graph :results []}))]
    (save-graph graph)
    (json/generate-string results)))

(defn delete-entities [{:keys [entityNames]}]
  (let [entity? (into #{} entityNames)
        relation? (fn [{:keys [from to]}] (or (entity? from) (entity? to)))]
    (save-graph
     (-> (load-graph)
         (update :entities (fn [coll] (filter (complement #(entity? (:name %))) coll)))
         (update :relations (fn [coll] (filter (complement #(relation? %)) coll))))))
  "Entities deleted successfully")

(defn delete-observation [coll {:keys [entityName observations]}]
  (->> coll
       (map (fn [m]
              (if (= entityName (:name m))
                (update m :observations (fn [obs] (remove (into #{} observations) obs)))
                m)))))

(defn delete-observations [{:keys [deletions]}]
  (save-graph
   (-> (load-graph)
       (update :entities (fn [entities] (reduce delete-observation entities deletions)))))
  "Observations deleted successfully")

(defn delete-relation [coll {:keys [from to relationType]}]
  (remove (fn [m] (and
                   (= from (:from m))
                   (= to (:to m))
                   (= relationType (:relationType m)))) coll))

(defn delete-relations [{:keys [relations]}]
  (save-graph
   (-> (load-graph)
       (update :relations (fn [coll] (reduce delete-relation coll relations)))))
  "Relations deleted succesfully")

(defn entity-matches? [q entity]
  (or
   (string/includes? (-> entity :name string/lower-case) q)
   (try (string/includes? (-> entity :entityType string/lower-case) q) (catch Throwable _ false))
   (try (some #(string/includes? (string/lower-case %) q) (:observations entity)) (catch Throwable _ false))))

(defn search-nodes [{:keys [query]}]
  (let [graph (load-graph)
        filtered-entities (filter (partial entity-matches? (string/lower-case query)) (:entities graph))
        filtered-entity-names (->> filtered-entities (map :name) (into #{}))]
    (json/generate-string
      {:entities filtered-entities
       :relations (filter
                    #(and (filtered-entity-names (:from %)) (filtered-entity-names (:to %)))
                    (:relations graph))})))

(defn open-nodes [{:keys [names]}]
  (let [graph (load-graph)
        entity-names (into #{} names)
        filtered-entities (filter (comp entity-names :name) (:entities graph))
        filtered-entity-names (->> filtered-entities (map :name) (into #{}))]
    (json/generate-string
      {:entities filtered-entities
       :relations (filter
                    #(and (filtered-entity-names (:from %)) (filtered-entity-names (:to %)))
                    (:relations graph))})))

(defn read-graph [_]
  (json/generate-string (load-graph))) 


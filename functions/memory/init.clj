(ns init
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.java.io :as io]
   [clojure.string :as string]))

(defn- item [graph item]
  (let [{:keys [type] :as m} (json/parse-string item keyword)]
    (case type
      "entity" (update graph :entities (fnil conj []) m)
      "relation" (update graph :relations (fnil conj []) m))))

(def db-file "/memory/memory.json")
#_(def db-file "memory.json")

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

(comment
  (fs/delete db-file)
  (save-graph
   (load-graph)))

(defn- entity? [graph e]
  (some #(= (:name e) (:name %)) (:entities graph)))

;; must have names
(defn create-entities [{:keys [entities]}]
  (let [graph (load-graph)
        new-entities (->> entities
                          (filter
                           (complement (partial entity? graph))))]
    (save-graph (update graph :entities concat new-entities))
    new-entities))

(comment
  (create-entities {:entities [{:name "me"} {:name "rod"}]}))

(defn- relation? [graph e]
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
                             (partial relation? graph))))]
    (save-graph (update graph :relations (fnil concat []) new-relations))
    new-relations))

(comment
  (create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})
  (load-graph))

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
    agg))

(comment
  (add-observation
   {:graph {:entities [{:name "me"} {:name "rod"}]}}
   {:entityName "me" :contents ["fact"]}))

;; observations are a list of entityName contents maps - contents are string arrays
(defn add-observations [{:keys [observations]}]
  (let [graph (load-graph)
        {:keys [results graph]} (->> observations
                                     (reduce
                                      add-observation
                                      {:graph graph :results []}))]
    (save-graph graph)
    results))

(comment
  (add-observations
   {:observations
    [{:entityName "me" :contents ["my personal email is slimslenderslacks@gmail.com"]}
     {:entityName "rod" :contents ["Rod is in Sydney, Australia"]}]})
  (load-graph))

(defn delete-entities [{:keys [entityNames]}]
  (let [entity? (into #{} entityNames)
        relation? (fn [{:keys [from to]}] (or (entity? from) (entity? to)))]
    (save-graph
     (-> (load-graph)
         (update :entities (fn [coll] (filter (complement #(entity? (:name %))) coll)))
         (update :relations (fn [coll] (filter (complement #(relation? %)) coll)))))))

(comment
  (do
    (fs/delete db-file)
    (create-entities {:entities [{:name "me"} {:name "rod"}]})
    (create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})
    (add-observations
     {:observations
      [{:entityName "me" :contents ["my personal email is slimslenderslacks@gmail.com"]}
       {:entityName "rod" :contents ["Rod is in Sydney, Australia"]}]})
    (load-graph))

  (delete-entities {:entityNames ["rod"]})
  (load-graph))

(defn delete-observation [coll {:keys [entityName observations]}]
  (->> coll
       (map (fn [m]
              (if (= entityName (:name m))
                (update m :observations (fn [obs] (remove (into #{} observations) obs)))
                m)))))

(defn delete-observations [{:keys [deletions]}]
  (save-graph
   (-> (load-graph)
       (update :entities (fn [entities] (reduce delete-observation entities deletions))))))

(comment
  (do
    (fs/delete db-file)
    (create-entities {:entities [{:name "me"} {:name "rod"}]})
    (create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})
    (add-observations
     {:observations
      [{:entityName "me" :contents ["my personal email is slimslenderslacks@gmail.com"]}
       {:entityName "rod" :contents ["Rod is in Sydney, Australia"]}]})
    (load-graph))

  (delete-observations {:deletions [{:entityName "rod" :observations ["Rod is in Sydney, Australia"]}]})
  (load-graph))

(defn delete-relation [coll {:keys [from to relationType]}]
  (remove (fn [m] (and
                   (= from (:from m))
                   (= to (:to m))
                   (= relationType (:relationType m)))) coll))

(defn delete-relations [{:keys [relations]}]
  (save-graph
   (-> (load-graph)
       (update :relations (fn [coll] (reduce delete-relation coll relations))))))

(defn entity-matches? [q entity]
  (or
   (string/includes? (-> entity :name string/lower-case) q)
   (try (string/includes? (-> entity :entityType string/lower-case) q) (catch Throwable _ false))
   (try (some #(string/includes? (string/lower-case %) q) (:observations entity)) (catch Throwable _ false))))

(defn search-nodes [{:keys [query]}]
  (let [graph (load-graph)
        filtered-entities (filter (partial entity-matches? (string/lower-case query)) (:entities graph))
        filtered-entity-names (->> filtered-entities (map :name) (into #{}))]
    {:entities filtered-entities
     :relations (filter
                 #(and (filtered-entity-names (:from %)) (filtered-entity-names (:to %)))
                 (:relations graph))}))

(defn open-nodes [{:keys [names]}]
  (let [graph (load-graph)
        entity-names (into #{} names)
        filtered-entities (filter (comp entity-names :name) (:entities graph))
        filtered-entity-names (->> filtered-entities (map :name) (into #{}))]
    {:entities filtered-entities
     :relations (filter
                 #(and (filtered-entity-names (:from %)) (filtered-entity-names (:to %)))
                 (:relations graph))}))

(comment
  (do
    (fs/delete db-file)
    (create-entities {:entities [{:name "me"} {:name "rod"}]})
    (create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})
    (add-observations
     {:observations
      [{:entityName "me" :contents ["my personal email is slimslenderslacks@gmail.com"]}
       {:entityName "rod" :contents ["Rod is in Sydney, Australia"]}]})
    (load-graph))

  (search-nodes {:query "rod"})
  (open-nodes {:names ["me" "rod"]})
  (load-graph))

(try
  (let [[s raw-json-string] *command-line-args*
        m (json/parse-string raw-json-string true)]
    (println
     ((get (ns-publics 'init) (symbol s)) m)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))


(ns init
  (:require
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
    (catch Throwable t
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
  (if-let [entity (first (filter #(= entityName (:name %)) (-> agg :graph :entities)))]
    (let [new-observations []
          n 0]
      (-> agg
          (update :results conj {:entityName entityName :addedObservations new-observations})
          (update :graph (update-in [:entities n :observations] (fnil concat []) new-observations))))
    agg))

;; observations are a list of entityName contents maps - contents are string arrays
(defn add-observations [{:keys [observations]}]
  (let [graph (load-graph)
        {:keys [results graph]}
        (->> observations
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
  (save-graph
   (-> (load-graph)
       (update :entities (fn [entities] (filter entities)))
       (update :relations (fn [relations] (filter relations))))))
(defn delete-observations [{:keys [deletions]}]
  (save-graph
   (-> (load-graph)
       (update :entities (fn [entities])))))
(defn delete-relations [{:keys [relations]}]
  (save-graph
   (-> (load-graph)
       (update :relations (fn [entities])))))
(defn search-nodes [{:keys [query]}])
(defn open-nodes [{:keys [names]}])

(try
  (let [[s raw-json-string] *command-line-args*
        m (json/parse-string raw-json-string true)]
    (println
     ((get (ns-publics 'init) (symbol s)) m)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))


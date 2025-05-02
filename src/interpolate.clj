(ns interpolate
  (:require
   [cheshire.core :as json]
   [clojure.edn :as edn]
   [clojure.string :as string]
   [selmer.filters :as filters]
   [selmer.parser :as selmer]))

(set! *warn-on-reflection* true)

(filters/add-filter! :into (fn [v]
                             (if (coll? v)
                               [:safe [:coll (into [] v)]]
                               v)))

(defn parse-path [s]
  (when s
    (if-let [[_ drive path] (re-find #"(\p{Alpha}):(.*)" s)]
      {:source s
       :target (format "/drive/%s%s" (string/lower-case drive) (string/replace path #"\\" "/"))}
      {:source s
       :target s})))

(defn format-volume [{:keys [source target]}]
  (format "%s:%s" source target))

(filters/add-filter! :volume (fn [v]
                               (if (coll? v)
                                 (->> v (map parse-path) (map format-volume) (into []))
                                 (-> v parse-path format-volume))))

(filters/add-filter! :volume-target (fn [v]
                                      (if (coll? v)
                                        (->> v (map parse-path) (map :target) (into []))
                                        (-> v parse-path :target))))

(filters/add-filter! :or (fn [v s]
                           (if (or (nil? v) (= "" v))
                             []
                             v)))

(defn interpolate [m template]
  (when-let [s (selmer/render template m {})]
    (if-let [parsed (try (edn/read-string s) (catch Throwable _ nil))]
      (if (and (coll? parsed) (= :coll (first parsed)))
        (second parsed)
        [s])
      [s])))

(defn interpolate-coll [command-args arg-context]
  (->>
   command-args
   (mapcat (partial interpolate arg-context))
   (into [])))

(defn arg-context [json-arg-string]
  (merge
   {:raw (if json-arg-string
           json-arg-string
           "{}")}
   (when json-arg-string (json/parse-string json-arg-string true))))

(defn container-definition [definition defaults json-arg-string]
  (let [arg-context (merge
                     {:hostDir (:host-dir defaults)}
                     (arg-context json-arg-string))]
    (cond-> (merge
             (:container definition)
             (dissoc defaults :functions)
             (when (-> definition :container :command)
               {:command (interpolate-coll
                          (-> definition :container :command)
                          arg-context)})
             (when (-> definition :container :entrypoint)
               {:entrypoint (->> (-> definition :container :entrypoint)
                                 (map (fn [s] (first (interpolate arg-context s))))
                                 (into []))})
             (when (-> definition :container :mounts)
               {:mounts (interpolate-coll (-> definition :container :mounts) arg-context)})
             (when (-> definition :container :volumes)
               {:volumes (interpolate-coll (-> definition :container :volumes) arg-context)})
             (when (-> definition :container :environment)
               {:environment (->> (seq (-> definition :container :environment))
                                  (map (fn [[k v]] [k (first (interpolate arg-context v))]))
                                  (filter (fn [[_ v :as l]] (when (not (or (nil? v) (= "" v))) l)))
                                  (into {}))})
              ;; workdirs in a container definition will always override ones
              ;; set in the metadata
             (when-let [wd (or
                            (-> definition :container :workdir)
                            (:workdir defaults))]
               {:workdir (first (interpolate arg-context wd))}))

      (-> definition :container :stdin :file) (update-in
                                               [:stdin :file]
                                               (fn [s] (first (interpolate arg-context s))))

      (-> definition :container :stdin :content) (update-in
                                                  [:stdin :content]
                                                  (fn [s] (first (interpolate arg-context s)))))))

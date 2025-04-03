(ns interpolate
  (:require
   [cheshire.core :as json]
   [clojure.edn :as edn]
   [selmer.filters :as filters]
   [selmer.parser :as selmer]))

(set! *warn-on-reflection* true)

(filters/add-filter! :into (fn [v]
                             (if (coll? v)
                               [:safe [:coll (into [] v)]]
                               v)))

(filters/add-filter! :volume (fn [v]
                               (if (coll? v)
                                 (->> v (map #(format "%s:%s" % %)) (into []))
                                 (format "%s:%s" v v))))

(filters/add-filter! :or (fn [v s]
                           (if (or (nil? v) (= "" v))
                             []
                             v)))

(comment
  "this allows us to expand strings into lists of strings to be spread into container definitions"
  (selmer/render "{{hello.you|volume|into}}" {:hello {:you ["yes" "no"]}})
  (selmer/render "{{hello.you|volume|into}}" {}))

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
             {:command (interpolate-coll
                        (-> definition :container :command)
                        arg-context)}
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
                                  (filter (fn [[_ v :as l]] (when v l)))
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

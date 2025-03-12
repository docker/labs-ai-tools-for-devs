(ns init
  (:require
   [cheshire.core :as json]
   [clojure.spec.alpha :as s]))

;; validate initial thought
;; read in previous thought history
;; read in branches which are maps of named thought collections
;; 
;; return text message with current thought
;; 
(s/def ::thought string?)
(s/def ::thoughtNumber number?)
(s/def ::totalThoughts number?)
(s/def ::nextThoughtNeeded boolean?)

(s/def ::isRevision boolean?)
(s/def ::revisesThought number?)
(s/def ::branchFromThought number?)
(s/def ::branchId string?)
(s/def ::needsMoreThoughts boolean?)
(s/def ::thought-data (s/keys :req-un [::thought ::thoughtNumber ::totalThoughts ::nextThoughtNeeded]
                              :opt-un [::isRevision ::revisesThought ::branchFromThought ::branchId ::needsMoreThoughts]))

(defn process-thought
  [m]
  (if (not (s/valid? ::thought-data m))
    (throw (ex-info "Invalid thought data" (s/explain-data ::thought-data m)))
    (let  [thought-history (try (json/parse-string (slurp "/sequentialthining/thought-history.json") keyword) (catch Throwable _ []))
           branches (try (json/parse-string (slurp "branches.json") keyword) (catch Throwable _ {}))]
      (spit "/sequentialthinking/thought-history.json"
            (json/generate-string
              (conj thought-history (cond-> m
                                      (> (:thoughtNumber m) (:totalThoughts m)) (assoc :totalThoughts (:thoughtNumber m))))))
      (when (= (:branchFromThought m) (:branchId m)) 
        (spit "/sequentialthinking/branches.json"
              (json/generate-string
                (update branches (:branchId m) (fnil conj []) m))))
      (-> m
          (select-keys [:thoughtNumber :totalThoughts :nextThoughtNeeded])
          (assoc :branches (keys branches))
          (assoc :thoughtHistoryLength (count thought-history))))))

(defn -main [& args]
  (try
    (-> (json/parse-string (first args) keyword)
        (process-thought)
        (json/generate-string)
        (println)) 
    (catch Throwable t
      (println (.getMessage t))
      (System/exit 1))))

(apply -main *command-line-args*)

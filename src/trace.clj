(ns trace 
  (:require
   [cheshire.core :as json]))

(def trace (atom {}))

(defn container-call [definition]
  (swap! trace update-in [:container-calls] (fnil concat []) [(into {} (dissoc definition :prompts))]))

(defn dump []
  (spit "trace.edn" (pr-str @trace)))

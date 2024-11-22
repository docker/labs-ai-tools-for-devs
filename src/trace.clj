(ns trace 
  (:require
   [cheshire.core :as json]
   jsonrpc))

(def trace (atom {}))

(defn container-call [definition]
  (swap! trace update-in [:container-calls] (fnil concat []) [(into {} (dissoc definition :prompts))]))

(defn dump []
  (spit "trace.json" (try 
                       (json/generate-string @trace)
                       (catch Throwable t
                         (jsonrpc/notify :error {:content (str t)})))))


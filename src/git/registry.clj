(ns git.registry 
  "Deprecated: git.registry is a registry.edn in the prompts volume
     This is only used by the old vsocde extension register/unregister commands"
  (:require
   [clojure.edn :as edn]
   [dir]
   [logging :refer [warn]]
   prompts.core))

(set! *warn-on-reflection* true)

(defn read-registry
  "read the from the prompt registry in the current engine volume"
  []
  (try
    (edn/read-string (slurp (prompts.core/registry-file)))
    (catch java.io.FileNotFoundException _
      {:prompts []})
    (catch Throwable t
      (warn "Warning (corrupt registry.edn): {{ t }}" {:exception t})
      {:prompts []})))

(defn update-registry
  "update the prompt registry in the current engine volume"
  [f]
  (spit (prompts.core/registry-file) (pr-str (f (read-registry)))))


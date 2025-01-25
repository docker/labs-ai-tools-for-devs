(ns build
  (:require [clojure.tools.build.api :as b]))

(def class-dir "target/classes")
(def basis (b/create-basis {:project "deps.edn"}))

(defn compile-java [_]
  (b/delete {:path "target"})
  (b/javac {:src-dirs ["src/java"]
            :class-dir class-dir
            :basis basis
            :javac-opts ["-source" "8" "-target" "8"]}))

(defn uber [_]
  (compile-java nil)  ; Compile Java first
  (b/copy-dir {:src-dirs ["src/clojure" "resources"]
               :target-dir class-dir})
  (b/compile-clj {:basis     basis               ; compile clojure code
                  :src-dirs  ["src/clojure"]
                  :class-dir class-dir})
  (b/uber {:class-dir class-dir
           :uber-file "target/my-project.jar"
           :basis basis
           :main 'docker.ts}))

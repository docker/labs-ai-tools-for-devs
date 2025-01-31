(ns script)

(defmacro read-script-at-compile-time [path]
  (slurp path))

(comment
  (macroexpand '(read-script-at-compile-time "src/volumes/collect.clj")))

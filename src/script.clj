(ns script)

(defmacro read [path]
  (slurp path))

(comment
  (macroexpand '(read "src/volumes/collect.clj")))

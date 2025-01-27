(ns script)

(defmacro read [path]
  `(slurp ~path))

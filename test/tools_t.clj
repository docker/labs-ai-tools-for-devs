(ns tools-t
  (:require [clojure.test :as t]
            [tools :refer [interpolate-coll]]))

(t/deftest interpolation
  (t/are [a b] (= a b)

    ["test" "" "why"] (interpolate-coll ["{{name}}" "{{blah}}" "why"] {:name "test"})
    [] (interpolate-coll nil {})
    [] (interpolate-coll nil nil)

    ["a" "b"] (interpolate-coll ["{{name|into}}"] {:name ["a" "b"]})
    ["hello"] (interpolate-coll ["hello"] {})))


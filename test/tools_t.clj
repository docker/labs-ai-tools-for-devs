(ns tools-t
  (:require
   [cheshire.core :as json]
   [clojure.test :as t]
   [interpolate :refer [interpolate-coll] :as interpolate]
   [selmer.parser :as selmer]))

(t/deftest interpolation
  (t/are [a b] (= a b)

    ["test" "" "why"] (interpolate-coll ["{{name}}" "{{blah}}" "why"] {:name "test"})
    [] (interpolate-coll nil {})
    [] (interpolate-coll nil nil)

    ["a" "b"] (interpolate-coll ["{{name|into}}"] {:name ["a" "b"]})
    ["hello"] (interpolate-coll ["hello"] {}))
  (t/are [a b] (= a b)

  ;; "this allows us to expand strings into lists of strings to be spread into container definitions"
    (pr-str [:coll ["yes:yes" "no:no"]]) (selmer/render "{{hello.you|volume|into}}" {:hello {:you ["yes" "no"]}})
    (pr-str [:coll []]) (selmer/render "{{hello.you|or:[]|volume|into}}" {})))

(t/deftest interpolate-calls
  (t/are [a b] (= a b)
    ["/Users/slim/whatever.json:/Users/slim/whatever.json"] (interpolate/interpolate {:openApiSchemaPath "/Users/slim/whatever.json"} "{{openApiSchemaPath|volume|into}}")
    ["/Users/slim:/Users/slim"] (interpolate/interpolate {:filesystem {:paths "/Users/slim"}} "{{filesystem.paths|volume|or:[]|into}}")
    [] (interpolate/interpolate {} "{{openApiSchemaPath|or:[]|volume|into}}")))

(t/deftest container-definition-interpolations
  (t/are [a b] (= a (:volumes b))
    ["/Users/slim:/Users/slim"]
    (interpolate/container-definition
     {:container {:volumes ["{{filesystem.paths|volume|into}}"]}}
     {}
     (json/generate-string {:filesystem {:paths ["/Users/slim"]}}))

    ["/Users/slim/whatever.json:/Users/slim/whatever.json"]
    (interpolate/container-definition
     {:container {:volumes ["{{openApiSchemaPath|volume|into}}"]}}
     {}
     (json/generate-string {:openApiSchemaPath "/Users/slim/whatever.json"}))

    []
    (interpolate/container-definition
     {:container {:volumes ["{{openApiSchemaPath|or:[]|volume|into}}"]}}
     {}
     (json/generate-string {})))

  (t/is
    (= ["--argument" "a" "b"]
       (:command
         (interpolate/container-definition
           {:container {:command ["--argument"
                                  "{{args|into}}"]}}
           {}
           (json/generate-string {:args ["a" "b"]}))))))

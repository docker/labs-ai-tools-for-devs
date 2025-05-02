(ns interpolate-t
  (:require
   [cheshire.core :as json]
   [clojure.test :as t]
   [interpolate]
   [selmer.parser :as selmer]))

(t/deftest container-defintion-tests
  (t/is 
    (=
     {:environment {"YES" "yes"}}
     (interpolate/container-definition
       {:container
        {:environment
         {"YES" "{{data.yes}}"
          "NO" "{{data.no}}"}}} 
       {} 
       (json/generate-string {:data {:yes "yes"}})))))

(comment
  "this allows us to expand strings into lists of strings to be spread into container definitions"
  (selmer/render "{{hello.you|volume|into}}" {:hello {:you ["yes" "no"]}})
  (selmer/render "{{hello.you|volume|into}}" {:hello {:you ["/Users/slim" "/Users/slim/Desktop"]}})
  (selmer/render "{{hello.you|volume-target|into}}" {:hello {:you ["C:\\hello" "C:\\goodbye"]}})
  (selmer/render "{{hello.you|volume|into}}" {:hello {:you ["C:\\hello" "C:\\goodbye"]}})
  (selmer/render "{{hello.you|volume|into}}" {}))

;; usually volume|into
;; 


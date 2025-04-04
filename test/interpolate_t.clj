(ns interpolate-t
  (:require
   [cheshire.core :as json]
   [clojure.test :as t]
   [interpolate]))

(t/deftest container-defintion-tests
  (t/is 
    (=
     {:command []
      :environment {"YES" "yes"}}
     (interpolate/container-definition
       {:container
        {:environment
         {"YES" "{{data.yes}}"
          "NO" "{{data.no}}"}}} 
       {} 
       (json/generate-string {:data {:yes "yes"}})))))

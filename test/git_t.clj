(ns git-t
  (:require [git]
            [clojure.test :as t]))

(t/deftest uuid-tests
  (t/is (= "3e688838-ca86-56e5-8906-89bf2ab585ce" (git/hashch {}))))

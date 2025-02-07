(ns init-t
  (:require
   [babashka.fs :as fs]
   [clojure.test :as t]
   [memory :as m])
  (:import
   [clojure.lang ExceptionInfo]))

(alter-var-root #'m/db-file (constantly "memory.json"))

(t/deftest test-save-load
  (fs/delete m/db-file)
  (#'m/save-graph
   (#'m/load-graph))
  (t/is (= {} (#'m/load-graph))))

(t/deftest test-create-entities
  (fs/delete m/db-file)
  (t/is (= "[{\"name\":\"me\"},{\"name\":\"rod\"}]" (m/create-entities {:entities [{:name "me"} {:name "rod"}]})))
  (t/is (= "[]" (m/create-entities {:entities [{:name "me"} {:name "rod"}]})))
  (t/is (= {:entities
            [{:name "me", :type "entity"}
             {:name "rod", :type "entity"}]}
           (#'m/load-graph))))

(t/deftest test-create-relations
  (fs/delete m/db-file)
  (m/create-entities {:entities [{:name "me"} {:name "rod"}]})
  (t/is (= "[{\"from\":\"me\",\"to\":\"rod\",\"relationType\":\"friend\"}]" (m/create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})))
  (t/is (= "[]" (m/create-relations {:relations [{:from "me" :to "rod" :relationType "friend"}]})))
  (t/is (= {:entities
            [{:name "me", :type "entity"}
             {:name "rod", :type "entity"}],
            :relations [{:from "me", :to "rod", :relationType "friend", :type "relation"}]}
           (#'m/load-graph)))
  (t/is (= "{\"entities\":[{\"name\":\"me\",\"type\":\"entity\"},{\"name\":\"rod\",\"type\":\"entity\"}],\"relations\":[{\"from\":\"me\",\"to\":\"rod\",\"relationType\":\"friend\",\"type\":\"relation\"}]}"
           (m/read-graph {}))))

(t/deftest test-missing-observerations
  (fs/delete m/db-file)
  (m/create-entities {:entities [{:name "me"} {:name "rod"}]})
  (t/is (thrown? ExceptionInfo (m/add-observations {:observations [{:entityName "you" :contents ["my personal email is"]}]})))
  (t/is (= "[{\"entityName\":\"me\",\"addedObservations\":[\"my personal email is\"]}]"
           (m/add-observations {:observations [{:entityName "me" :contents ["my personal email is"]}]})))
  (t/is (= {:entities
            [{:name "me", :type "entity", :observations ["my personal email is"]}
             {:name "rod", :type "entity"}]}
            (#'m/load-graph))))

(t/deftest test-query
  (fs/delete m/db-file)
  (m/create-entities {:entities [{:name "me"} {:name "rod"}]})
  (t/is (= "[{\"entityName\":\"me\",\"addedObservations\":[\"my personal email is\"]}]"
           (m/add-observations {:observations [{:entityName "me" :contents ["my personal email is"]}]})))
  (println (m/read-graph nil))
  (println (m/open-nodes {:names ["me" "rod"]}))
  (t/is (= "{\"entities\":[{\"name\":\"rod\",\"type\":\"entity\"}],\"relations\":[]}" (m/search-nodes {:query "rod"})))
  (t/is (= "{\"entities\":[{\"name\":\"me\",\"type\":\"entity\",\"observations\":[\"my personal email is\"]},{\"name\":\"rod\",\"type\":\"entity\"}],\"relations\":[]}" (m/open-nodes {:names ["me" "rod"]}))))

(t/deftest test-delete-observerations
  (fs/delete m/db-file)
  (m/create-entities {:entities [{:name "me"} {:name "rod"}]})
  (m/add-observations {:observations [{:entityName "me" :contents ["my personal email is"]}]})
  (m/delete-observations {:deletions [{:entityName "me" :observations ["my personal email is"]}]})
  (t/is (= "{\"entities\":[{\"name\":\"me\",\"type\":\"entity\",\"observations\":[]},{\"name\":\"rod\",\"type\":\"entity\"}]}" (m/read-graph nil))))


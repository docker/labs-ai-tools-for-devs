(ns schema-t
  (:require
   [clj-yaml.core :as yaml]
   [clojure.spec.alpha :as s]
   [clojure.test :as t]
   [schema]))

(t/deftest bad-def-tests
  ;; completely empty definition is valid
  (t/is
   (s/valid? :schema/prompts-file {:messages []
                                   :functions []
                                   :metadata {}}))
  ;; empty function maps are not valid
  (t/is
   (not
    (s/valid? :schema/prompts-file {:messages []
                                    :functions [{}]
                                    :metadata {}})))
  ;; functions must resolve to somthing that we can actually run
  (t/is
   (s/valid? :schema/prompts-file {:messages []
                                   :functions [{:function {:name "foo"
                                                           :description "foo"
                                                           :type "prompt"}
                                                :type "function"}]
                                   :metadata {}}))
  (t/is
   (not
    (s/valid? :schema/prompts-file {:messages []
                                    :functions [{:function {:name "foo"
                                                            :description "foo"
                                                            :container {}}
                                                 :type "function"}]
                                    :metadata {}})))
  (t/is
   (s/valid? :schema/prompts-file {:messages []
                                   :functions [{:function {:name "foo"
                                                           :description "foo"
                                                           :container {:image "image"}}
                                                :type "function"}]
                                   :metadata {}}))
  (t/is
    (not
      (s/valid? :schema/prompts-file {:messages []
                                      :functions [{:function {:name "foo"
                                                              :description "foo"
                                                              :container {:image "image"
                                                                          :command {:a "b"}}}
                                                   :type "function"}]
                                      :metadata {}}))))

;; this is one of the things that we need to explain
(s/explain :tool/container (:container (yaml/parse-string (slurp "test/resources/unquoted-moustache-command.yaml"))))

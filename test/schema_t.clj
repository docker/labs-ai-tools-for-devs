(ns schema-t
  (:require [clojure.test :as t]
            [schema]
            [clojure.spec.alpha :as s]))

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
    (s/conform :schema/prompts-file {:messages []
                                    :functions [{:function {:name "foo"
                                                            :description "foo"
                                                            :type "prompt"
                                                            }
                                                 :type "function"}]
                                    :metadata {}})))

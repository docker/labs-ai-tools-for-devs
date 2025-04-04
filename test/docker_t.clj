(ns docker-t
  (:require [clojure.test :as t]
            [docker]))

(t/deftest port-parsing-tests

  (t/is
    (= {"9222/tcp" [{:HostPort "9222"}]} (docker/port-bindings ["9222:9222"])))

  (t/is
    (= {"9222/tcp" {}} (docker/exposed-ports ["9222:9222"]))))

(t/deftest add-latest-tests
  (t/is 
    (= 
      "vonwig/go-linguist:latest"
      (docker/add-latest "vonwig/go-linguist")))
  (t/is
    (= 
      "blah/what:tag"
      (docker/add-latest "blah/what:tag"))))

(t/deftest injected-entrypoint-tests
  (t/is
    (= 
      "export A=$(cat /secret/a | sed -e \"s/^[[:space:]]*//\") ; export BLAH=whatever ; my command"
      (docker/injected-entrypoint {:a "A"} ["BLAH=whatever"] "my command")))
  (t/is
    (= 
      "my command"
      (docker/injected-entrypoint nil nil "my command")))
  (t/is
    (=
     "export A=$(cat /secret/a | sed -e \"s/^[[:space:]]*//\") ; my command"
     (docker/injected-entrypoint {:a "A"} nil "my command")))
  (t/is
    (=
     ""
     (docker/injected-entrypoint nil nil nil))))

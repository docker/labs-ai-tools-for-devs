(ns secrets-t
  (:require [docker]))

(def c
  (docker/create {:image "alpine"
                  :secrets ["brave.api_key"]
                  :entrypoint ["/bin/sh" "-c" "cat /secret/brave.api_key"]}))

(def c
  (docker/create {:image "alpine"
                  :secrets ["brave.api_key"]
                  :entrypoint ["/bin/sh" "-c" "ls -l /secret"]}))

(def c
  (docker/create {:image "alpine"
                  :secrets ["brave.api_key"]
                  :entrypoint ["/bin/sh" "-c" "whoami"]}))

(docker/start c)
(docker/attach c)

(docker/delete-container c)


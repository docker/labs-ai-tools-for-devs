(ns containers
  (:require [docker]))

(->> (docker/containers {})
     (map #(select-keys % [:Names :Status :State :Id :Image])))

'(:Ports
  :Image
  :Labels
  :Id
  :Mounts
  :HostConfig
  :Command
  :ImageID
  :Names
  :State
  :Created
  :NetworkSettings
  :Status)

(ns jsonrpc.producer)

(defprotocol IProducer
  (publish-exit [this params])
  (publish-progress [this params])
  (publish-log [this params])
  (publish-prompt-list-changed [this params])
  (publish-resource-list-changed [this params])
  (publish-resource-updated [this params])
  (publish-tool-list-changed [this params])
  (publish-docker-notify [this method params]))


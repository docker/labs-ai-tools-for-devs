(ns jsonrpc.producer 
  (:require
   [jsonrpc.logger :as logger]
   [lsp4clj.server :as lsp.server]))

(defprotocol IProducer
  (publish-exit [this params])
  (publish-progress [this params])
  (publish-log [this params])
  (publish-prompt-list-changed [this params])
  (publish-resource-list-changed [this params])
  (publish-resource-updated [this params])
  (publish-tool-list-changed [this params])
  (publish-docker-notify [this method params]))

(defrecord McpProducer
           [server db*]
  IProducer

  (publish-exit [_this p]
    (logger/info "publish-exit " p)
    (lsp.server/discarding-stdout
     (->> p (lsp.server/send-notification server "$/exit"))))
  ; params is a map of progressToken, progress, and total
  (publish-progress [_this params]
    (lsp.server/discarding-stdout
     (->> params (lsp.server/send-notification server "notifications/progress"))))
  ; params is a map of level, logger, data
  ; level is debug info notice warning error critical alert emergency
  (publish-log [_this params]
    (->> params (lsp.server/send-notification server "notifications/message")))

  (publish-prompt-list-changed [_ params]
    (logger/info "send prompt list changed")
    (->> params (lsp.server/send-notification server "notifications/prompts/list_changed")))

  (publish-resource-list-changed [_ params]
    (logger/info "send resource list changed")
    (->> params (lsp.server/send-notification server "notifications/resources/list_changed")))

  (publish-resource-updated [_ params]
    (->> params (lsp.server/send-notification server "notifications/resources/updated")))

  (publish-tool-list-changed [_ params]
    (logger/info "send tool list changed")
    (->> params (lsp.server/send-notification server "notifications/tools/list_changed")))
  (publish-docker-notify [_ method params]
    (logger/info (format "%s - %s" method params))
    (lsp.server/send-notification server method params)))

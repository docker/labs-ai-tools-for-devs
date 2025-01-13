(ns copilot
  (:require [babashka.curl :as curl]
            [cheshire.core :as json]
            [clojure.pprint :as pprint]))

(def github-user-token "")

(def x
  (curl/get
    "https://api.github.com/copilot_internal/v2/token"
    {:throw false
     :headers {"Authorization" (format "Bearer %s" github-user-token)
               "Accept" "application/json"
               "Editor-Version" "vscode/1.91.0"
               "Editor-Plugin-Version" "copilot-chat/v0.17.2024062801"
               }}
    ))

(pprint/pprint x)

(def token (cheshire.core/parse-string (:body x) true))
;; _doRefreshRemoteAgents
;; getCopilotToken to make sure that your sku starts with "copilot_enterprise"
;; 
(def agent-response
  (curl/get 
    "https://api.githubcopilot.com/agents"
    {:throw false
     :headers {"Authorization" (format "Bearer %s" (:token token))
               "Editor-Version" "vscode/1.91.0"
               "Editor-Plugin-Version" "copilot-chat/v0.17.2024062801"
               }}))


(pprint/pprint (json/parse-string (:body agent-response)))
(pprint/pprint token)

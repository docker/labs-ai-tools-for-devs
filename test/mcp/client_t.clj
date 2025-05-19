(ns mcp.client-t
  (:require
   [clojure.core.async :as async]
   [clojure.string :as string]
   [docker]
   [jsonrpc.logger :as logger]
   [mcp.client :as client :refer [-get-resources -get-tools call-tool
                                  get-function-factory get-mcp-tools-from-prompt
                                  get-resource list-function-factory resource-cursor]]
   [repl]))

(repl/setup-stdout-logger)

(def github-mcp-server
  {:container
   {:image "mcp/github-mcp-server:latest"
    :secrets {:github.personal_access_token "GITHUB_PERSONAL_ACCESS_TOKEN"}}})

(def gdrive-mcp-server
  {:container
   {:image "vonwig/gdrive:latest"
    :workdir "/app"
    :volumes ["mcp-gdrive:/gdrive-server"]
    :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"
                  "GDRIVE_OAUTH_PATH" "/secret/google.gcp-oauth.keys.json"}
    :secrets {:google.gcp-oauth.keys.json "GDRIVE"}}})

(def time-server
  {:container
   {:image "mcp/time:latest"
    :workdir "/app"}})

(comment
  (dotimes [n 100]
    (logger/info "**** run " n)
    (let [tools
          (get-mcp-tools-from-prompt
            {:mcp [github-mcp-server]
             :local-get-tools -get-tools})]
      (logger/info "tool count " (count tools)) )
    (logger/info "**** finished run " n)))

(comment
  (get-mcp-tools-from-prompt
    {:mcp [gdrive-mcp-server]
     :local-get-tools -get-tools}))

(->> (client/resource-templates-cursor
       "cursor"
       [{:list-resource-templates (client/resource-templates-function-factory (:container github-mcp-server))}
        {:list-resource-templates (client/resource-templates-function-factory (:container gdrive-mcp-server))}])
     (async/take 100)
     (async/into [])
     (async/<!!))

(call-tool
  (:container github-mcp-server)
  {:name "get_me" :arguments {:reason "get my user info"}})

(comment
  (fn list-function [c cursor-name size]
    (async/go-loop [n 0]
      (if (< n 10)
        (let [coll (take 10 (iterate inc (* 10 n)))]
                       ;; this will block the go-loop waiting for the aggregate channel to read resources off of it
                       ;; each mcp server can have it's own caching
          (async/<! (async/onto-chan! c (into [] coll) false))
          (recur (inc n)))
        :done))))

(comment
  (count
   (async/<!!
    (async/into [] (resource-cursor
                    "cursor"
                    [{}
                     {:list (list-function-factory nil)}
                     {:list (list-function-factory nil)}])))))

(comment
  (repl/setup-stdout-logger)

  (->>
   (resource-cursor
    "cursor"
    [{:list (list-function-factory
             {:image "vonwig/gdrive:latest"
              :workdir "/app"
              :volumes ["mcp-gdrive:/gdrive-server"]
              :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"
                            "GDRIVE_OAUTH_PATH" "/secret/google.gcp-oauth.keys.json"}
              :secrets {:google.gcp-oauth.keys.json "GDRIVE"}})}])
   (async/take 10)
   (async/into [])
   (async/<!!)))

(comment
  (async/<!!
   (get-resource
    "hello"
    [{}
     {:get (get-function-factory nil)}
     {}])))

(comment
  (docker/run-container
   {:image "vonwig/stripe:latest"
    :secrets {:stripe.api_key "API_KEY"}
    :entrypoint ["/bin/sh" "-c" "cat /secret/stripe.api_key"]})
  (docker/run-container
   {:image "vonwig/stripe:latest"
    :secrets {:stripe.api_key "API_KEY"}
    :entrypoint ["/bin/sh" "-c" "cat /secret/stripe.api_key"]})
  (async/<!!
   (call-tool
    {:image "vonwig/stripe:latest"
     :entrypoint ["node" "/app/dist/index.js"]
     :secrets {"stripe.api_key" "API_KEY"}
     :command ["--tools=all"
               "--api-key=$API_KEY"]}
    {:name "create_customer"
     :arguments {:name "Jim Clark"}})))

(comment
  (repl/setup-stdout-logger)
  (docker/inject-secret-transform {:image "mcp/stripe:latest"
                                   :secrets {:stripe.api_key "API_KEY"}
                                   :command ["--tools=all"
                                             "--api-key=$API_KEY"]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/stripe:latest"
                                                 :secrets {:stripe.secret_key "STRIPE_SECRET_KEY"}
                                                 :command ["--tools=all"]}}]
                              :local-get-tools -get-tools})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/brave-search:latest"
                                                 :workdir "/app"
                                                 :secrets {:brave.api_key "BRAVE_API_KEY"}}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/slack:latest"
                                                 :workdir "/app"
                                                 :secrets {:slack.bot_token "SLACK_BOT_TOKEN"
                                                           :slack.team_id "SLACK_TEAM_ID"}}}]
                              :local-get-tools -get-tools})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/redis:latest"
                                                 :workdir "/app"}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/fetch:latest"
                                                 :workdir "/app"}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/time:latest"
                                                 :workdir "/app"}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "vonwig/youtube-transcript:latest"
                                                 :workdir "/app"}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/notion-server:latest"
                                                 :workdir "/app"
                                                 :secrets {:notion.api_token "NOTION_API_TOKEN"}}}]})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/puppeteer:latest"
                                                 :environment {"DOCKER_CONTAINER" "true"}}}]
                              :local-get-tools -get-tools})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "vonwig/openapi-schema:latest"}}]
                              :local-get-tools -get-tools})
  (docker/inject-secret-transform {:image "vonwig/gdrive:latest"
                                   :workdir "/app"
                                   :volumes ["mcp-gdrive:/gdrive-server"]
                                   :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"}})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "vonwig/gdrive:latest"
                                                 :workdir "/app"
                                                 :volumes ["mcp-gdrive:/gdrive-server"]
                                                 :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"}}}]
                              :local-get-tools -get-tools})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "mcp/jetbrains:latest"
                                                 :environment {"IDE_PORT" "8090"}}}]
                              :local-get-tools -get-tools})

  (-get-resources {:image "vonwig/gdrive:latest"
                   :workdir "/app"
                   :volumes ["mcp-gdrive:/gdrive-server"]
                   :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"
                                 "GDRIVE_OAUTH_PATH" "/secret/google.gcp-oauth.keys.json"}
                   :secrets {:google.gcp-oauth.keys.json "GDRIVE"}}
                  {})
  (get-mcp-tools-from-prompt {:mcp [{:container {:image "vonwig/gdrive:latest"
                                                 :workdir "/app"
                                                 :volumes ["mcp-gdrive:/gdrive-server"]
                                                 :environment {"GDRIVE_CREDENTIALS_PATH" "/gdrive-server/credentials.json"}}}]
                              :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/mcp-discord:latest"
            :workdir "/app"}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/notion:latest"
            ;:workdir "/app"
            :secrets {:notion.internal_integration_token "INTERNAL_INTEGRATION_TOKEN"}
            :environment {}
            }}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/discordmcp:latest"
            :workdir "/app"
            :secrets {:discord.token "DISCORD_TOKEN"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/everart:latest"
            :workdir "/app"
            :secrets {:everart.api_key "EVERART_API_KEY"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/gitlab:latest"
            :workdir "/app"
            :secrets {:gitlab.personal_access_token "GITLAB_PERSONAL_ACCESS_TOKEN"}
            :environment {"GILAB_API_URL" "https://gitlab.com"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/sentry:latest"
            :workdir "/app"
            :secrets {:sentry.auth_token "SENTRY_AUTH_TOKEN"}
            :command ["--auth-token" "$SENTRY_AUTH_TOKEN"]}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/resend:latest"
            :workdir "/app"
            :secrets {:resend.api_key "RESEND_API_KEY"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/obsidian:latest"
            :workdir "/app"
            :secrets {:obsidian.api_key "OBSIDIAN_API_KEY"}
            :environment {"GILAB_API_URL" "https://gitlab.com"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/aws-kb-retrieval-server:latest"
            :workdir "/app"
            :secrets {:aws.access_key_id "AWS_ACCESS_KEY_ID"
                      :aws.secret_access_key "AWS_SECRET_ACCESS_KEY"
                      :aws.region "REGION"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/github-mcp-server:latest"
            :secrets {:github.personal_access_token "GITHUB_PERSONAL_ACCESS_TOKEN"}}}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/kubernetes:latest" 
            :workdir "/usr/local/app" }}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/webflow:latest" 
            :workdir "/app"
            :secrets {:webflow.token "WEBFLOW_TOKEN"} }}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/azure:latest" 
            :workdir "/app"
            :command ["server" "start"] }}]
    :local-get-tools -get-tools})

  (get-mcp-tools-from-prompt
   {:mcp [{:container
           {:image "mcp/wikipedia-mcp" }}]
    :local-get-tools -get-tools})

  (docker/run-container
   (docker/inject-secret-transform
    {:image "mcp/time:latest"
     :workdir "/app"}))
  (docker/run-container
   (docker/inject-secret-transform
    {:image "mcp/stripe:latest"
     :workdir "/app"
     :secrets {:stripe.api_key "API_KEY"}
     :entrypoint ["cat" "/secret/stripe.api_key"]
     :command []})))

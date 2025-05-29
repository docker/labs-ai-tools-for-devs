(ns jsonrpc.prompt-change-events
  (:require
   [babashka.fs :as fs]
   [clojure.core.async :as async]
   [clojure.string :as string]
   docker
   [jsonrpc.db :as db]
   [jsonrpc.logger :as logger]
   [jsonrpc.producer :as producer]
   [jsonrpc.state :as state]
   [prompts.core :refer [registry]]
   repl
   shutdown))

(defn debounce-by
  "Debounce in channel with ms miliseconds distincting by by-fn."
  [in by-fn]
  (let [out (async/chan)]
    (async/go-loop [state {}]
      (let [{:keys [f] :as new-val} (async/<! in)
            v (by-fn new-val)]
        (when (not (= (get state f :blank) v))
          (async/>! out new-val))
        (recur (assoc state f v))))
    out))

(defn publish-change-event []
  (doseq [producer (vals @state/producers)]
    (try
      (producer/publish-tool-list-changed producer {})
      (producer/publish-prompt-list-changed producer {})
      (catch Throwable _))))

(defn registry-updated []
  (try
    (db/add-refs (db/registry-refs (registry)))
    (publish-change-event)
    (catch Throwable t
      (logger/error t "unable to parse registry.yaml"))))

(defn markdown-tool-updated [opts f]
  (try
    (db/update-prompt opts (string/replace f #"\.md" "") (slurp (fs/file (prompts.core/get-prompts-dir) f)))
    (publish-change-event)
    (catch Throwable t
      (logger/error t "unable to parse " f))))

(defn content [{:keys [f]}]
  (try (slurp (fs/file (prompts.core/get-prompts-dir) f)) (catch Throwable _ :empty)))

(defn init-dynamic-prompt-watcher [opts registry-updated markdown-tool-updated]
  (let [change-events-channel (async/chan)
        debounced (debounce-by change-events-channel content)]
    (doseq [container (docker/containers {:label ["com.docker.desktop.extension=true"
                                                  "com.docker.mcp.watch-service=true"]})]
      (logger/info "shutting down previous vonwig/inotifywait container" container)
      (try
        (docker/stop-container container)
        (docker/kill-container container)
        (docker/delete container)
        (catch Throwable _
          (logger/warn "unable to kill conainer " (:Id container)))))
    ;; debounce the change event channel
    (async/go-loop
     [evt (async/<! debounced)]
      (case (:type evt)
        :registry (registry-updated)
        :markdown (markdown-tool-updated (:opts evt) (:f evt))
        :unknown)
      (recur (async/<! debounced)))
    ;; watch filesystem
    (try
      (let [{x :container}
            (docker/run-streaming-function-with-no-stdin
              {:image "vonwig/inotifywait:latest"
               :labels {"com.docker.desktop.extension" "true"
                        "com.docker.mcp.watch-service" "true"
                        "com.docker.compose.project" "docker_labs-ai-tools-for-devs-desktop-extension"
                        "com.docker.compose.service" "registry-watcher"}
               :volumes [(format "%s:/prompts" (or (prompts.core/prompts-cache) "docker-prompts"))]
               :command ["-e" "create" "-e" "modify" "-e" "delete" "-q" "-m" "/prompts"]}
              (fn [line]
                (let [[_dir _event f] (string/split line #"\s+")]
                  (async/put!
                    change-events-channel
                    (cond
                      (= f "registry.yaml")
                      {:opts opts :f f :type :registry}
                      (string/ends-with? f ".md")
                      {:opts opts :f f :type :markdown}
                      :else
                      {})))))]
        (shutdown/schedule-container-shutdown
          (fn []
            (logger/info "inotifywait shutting down")
            (docker/kill-container x)
            (docker/delete x))))
      (catch Throwable t
        (logger/error "unable to start registry.yaml watcher" t)))))

(comment
  (repl/setup-stdout-logger)
  (init-dynamic-prompt-watcher
   {}
   (fn [] (logger/info "registry updated"))
   (fn [& args] (logger/info "markdown updated " args))))



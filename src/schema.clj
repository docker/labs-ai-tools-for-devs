(ns schema
  (:require
   [babashka.fs :as fs]
   [clojure.spec.alpha :as s]
   [clojure.string :as string]))

(defn validate [k]
  (fn [m]
    (if (s/valid? k m)
      m
      (throw (ex-info "invalid args" {:explanation (s/explain-data k m)})))))

(s/def :context/parameters (s/map-of string? any?))

;; ========= Spec Definitions =========

;; -- Spec Definitions for Command Line Arguments --
(s/def ::platform (fn [s] (#{:darwin :linux :windows} (keyword (string/lower-case s)))))
(s/def ::user string?)
(s/def ::jwt string?)
(s/def ::pat string?)
(s/def ::prompts #(fs/exists? %))
(s/def ::host-dir string?)
(s/def ::offline boolean?)
(s/def ::thread-id string?)
(s/def ::save-thread-volume boolean?)
(s/def ::url string?)
(s/def ::run-args (s/keys :req-un [::platform ::prompts ::host-dir]
                          :opt-un [::offline ::thread-id ::save-thread-volume ::user ::pat ::jwt ::url :context/parameters]))

;; -- Spec Definitions for Docker Container --
(s/def ::host-dir string?)
(s/def ::user string?)
(s/def ::jwt string?)
(s/def ::file string?)
(s/def ::content string?)

(s/def ::pty-output string?)
(s/def ::exit-code integer?)
(s/def ::info any?)
(s/def ::done #{:timeout :exited :running})
(s/def ::timeout integer?)
(s/def ::kill-container any?)
(s/def ::container-response (s/keys :req-un [::pty-output ::exit-code ::info ::done]
                                    :opt-un [::timeout ::kill-container]))

;; -- tool parameters --
(s/def :tool/parameters any?)

;; -- container tools --
(s/def :container/background boolean?)
(s/def :container/image string?)
(s/def :container/command (s/coll-of string?))
(s/def :container/stdin (s/keys :opt-un [::file ::content]))
(s/def :container/volumes (s/coll-of string?))
(s/def :container/ports (s/coll-of string?))
(s/def :container/entrypoint string?)
(s/def :container/workdir string?)
(s/def :container/network_mode (s/or :standard #{"host" "none" "bridge"}
                                     :container (fn [s] (re-find #"container:.*" s))
                                     :custom string?))
(s/def :tool/container (s/keys :req-un [:container/image]
                               :opt-un [::host-dir
                                        ::thread-id
                                        ::user
                                        ::jwt
                                        :container/background
                                        :container/stdin
                                        :container/command
                                        :container/volumes
                                        :container/entrypoint
                                        :container/workdir
                                        :container/ports  ; port mappings (incompatible with network_mode of host)
                                        :container/network_mode]))

;; -- Spec definitions for Tools --
(s/def ::github-ref (s/and string? #(string/starts-with? % "github:")))
(s/def :prompt/ref ::github-ref)
(s/def :prompt/prompt (s/or :github-ref ::github-ref :relative-path string?))
(s/def :tool/name string?)
(s/def :docker/type #{"prompt"})
(s/def :tool/description string?)
(s/def ::prompt-tool (s/keys :req-un [:tool/name :tool/description :docker/type]
                             :opt-un [:tool/parameters :prompt/prompt :prompt/ref]))
(s/def ::container-tool (s/keys :req-un [:tool/name :tool/description :tool/container]
                                :opt-un [:tool/parameters]))
(s/def :tool/function (s/or :container ::container-tool :prompt ::prompt-tool))
(s/def :tool/type #{"function"})
(s/def ::tool (s/keys :req-un [:tool/type :tool/function]))
(s/def ::tools (s/coll-of ::tool))
;; functions and tools are aliases
(s/def ::functions ::tools)


;; -- Spec definitions for prompt metadata --
(s/def ::agent string?)
(s/def ::model string?)
(s/def ::prompt-format #{"django"})
(s/def ::extractors (s/coll-of ::extractor))
(s/def ::metadata (s/keys :opt-un [::host-dir
                                   ::model
                                   ::url
                                   ::stream
                                   ::timeout
                                   ::extractors
                                   ::agent
                                   ::description
                                   ::prompt-format]))

;; -- Spec Definitions for Graph state --
;; TODO - can be image, audio, and text content
(s/def ::message-content any?)
(s/def ::opts ::run-args)
(s/def ::role #{"user" "assistant" "tool" "system"})
(s/def ::content (s/or :string string? :coll (s/coll-of ::message-content)))
(s/def ::messages (s/coll-of (s/keys :req-un [::role ::content])))
(s/def ::state (s/keys :req-un [::metadata ::opts ::functions ::messages]))
;; this is the data that can be extracted from a prompts file, whether it's yaml or markdown
(s/def ::prompts-file (s/keys :req-un [::messages ::functions ::metadata]))

;; we need to parse a lot of tool_calls here
(def message-with-tool-calls
  {:role "assistant"
   :content ""
   :tool_calls
   [{:id "tool-call-id"
     :function
     {:name ""
      :arguments "serialized json"}}]})

;; response from both openai and claude sampling
(comment
  (s/def ::name string?)
  (s/def ::arguments string?)
  (s/def ::id string?)
  (s/def :response/function (s/keys :req-un [::name ::arguments]))
  (s/def :function/type #{"function"})
  (s/def ::tool_call (s/keys :req-un [:response/function ::id :function/type]))
  (s/def ::tool_calls (s/coll-of ::tool_call))
  (s/def :response/role #{"assistant"})
  (s/def :response/content string?)
  (s/def ::message (s/keys :req-un [:response/role]
                           :opt-un [:response/content ::tool_calls]))
  (s/def ::messages (s/coll-of ::message))
  ;; Claude uses tool_use but we'll standardize on tool_calls (the openai term)
  (s/def ::finish-reason any?)
  (s/def ::response (s/keys :req-un [::finish-reason ::messages])))


(ns docker
  (:require
   [babashka.curl :as curl]
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.pprint :refer [pprint]]
   [clojure.spec.alpha :as spec]
   [clojure.string :as string]
   [creds]
   jsonrpc
   logging)
  (:import
   [java.net UnixDomainSocketAddress]
   [java.nio ByteBuffer]
   [java.nio.channels SocketChannel]
   [java.util Arrays Base64]))

(set! *warn-on-reflection* true)

(defn encode [to-encode]
  (.encodeToString (Base64/getEncoder) (.getBytes ^String to-encode)))

;; https://index.docker.io/v1/ does not return IdentityTokens so we 
;; probably won't use this endpoint
#_{:clj-kondo/ignore [:clojure-lsp/unused-public-var]}
(defn auth
  [creds]
  (curl/post
   "http://localhost/auth"
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :body (json/generate-string creds)}))

(defn pull-image [{:keys [image identity-token creds]}]
  (curl/post
   (format "http://localhost/images/create?fromImage=%s" image)
   (merge
    {:raw-args ["--unix-socket" "/var/run/docker.sock"]
     :throw false}
    (when (or creds identity-token)
      {:headers {"X-Registry-Auth"
                  ;; I don't think we'll be pulling images
                  ;; from registries that support identity tokens
                 (-> (cond
                       identity-token {:identitytoken identity-token}
                       creds creds)
                     (json/generate-string)
                     (encode))}}))))

(defn unix-socket-file [s]
  (when (.exists (fs/file s))
    s))

(defn- get-backend-socket []
  (let [coll [(or (System/getenv "DOCKER_DESKTOP_SOCKET_PATH") "")
              (format "%s/Library/Containers/com.docker.docker/Data/backend.sock" (System/getenv "HOME"))]]
    (some unix-socket-file coll)))

(defn backend-is-logged-in? [_]
  (curl/get
   "http://localhost/registry/is-logged-in"
   {:raw-args ["--unix-socket" (get-backend-socket)]
    :throw false}))

(defn backend-login-info [_]
  (curl/get
   "http://localhost/registry/info"
   {:raw-args ["--unix-socket" (get-backend-socket)]
    :throw false}))

(defn backend-get-token [_]
  (curl/get
   "http://localhost/registry/token"
   {:raw-args ["--unix-socket" (get-backend-socket)]
    :throw false}))

(comment
  (let [pat (string/trim (slurp "/Users/slim/.secrets/dockerhub-pat-ai-tools-for-devs.txt"))]
    (pull-image {:image "vonwig/go-linguist:latest"
                 :creds {:username "jimclark106"
                         :password pat
                         :serveraddress "https://index.docker.io/v1/"}})))

(defn list-images [m]
  (curl/get
   "http://localhost/images/json"
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :query-params {:filters (json/generate-string m)}
    :throw false}))

(defn delete-image [{:keys [image]}]
  (curl/delete
   (format "http://localhost/images/%s?force=true" image)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn container->archive [{:keys [Id path]}]
  (curl/get
   (format "http://localhost/containers/%s/archive?path=%s" Id path)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false
    :as :stream}))

;; check for 201
;; entrypoint is an array of strings
;; env is a map
;; Env is an array of name=value strings
;; Tty wraps the process in a pseudo terminal
{:StdinOnce true
 :OpenStdin true}
(defn create-container [{:keys [image entrypoint working-dir command host-dir env thread-id opts mounts] :or {opts {:Tty true}} :as m}]
  #_(jsonrpc/notify :message {:content (str m)})
  (let [payload (json/generate-string
                 (merge
                  {:Image image}
                  opts
                  (when env {:env (->> env
                                       (map (fn [[k v]] (format "%s=%s" (name k) v)))
                                       (into []))})
                  {:HostConfig
                   {:Binds
                    (concat ["docker-lsp:/docker-lsp"
                             "/var/run/docker.sock:/var/run/docker.sock"]
                            (when host-dir [(format "%s:/project:rw" host-dir)])
                            (when thread-id [(format "%s:/thread:rw" thread-id)])
                            mounts)}
                   :WorkingDir (or working-dir "/project")}
                  (when entrypoint {:Entrypoint entrypoint})
                  (when command {:Cmd command})))]
    (curl/post
     "http://localhost/containers/create"
     {:raw-args ["--unix-socket" "/var/run/docker.sock"]
      :throw false
      :body payload
      :headers {"Content-Type" "application/json"
                "Content-Length" (count payload)}})))

(defn create-volume [{:keys [Name]}]
  (curl/post "http://localhost/volumes/create"
             {:raw-args ["--unix-socket" "/var/run/docker.sock"]
              :throw false
              :body (json/generate-string {:Name Name})
              :headers {"Content-Type" "application/json"}}))

(defn remove-volume [{:keys [Name]}]
  (curl/delete (format "http://localhost/volumes/%s" Name)
               {:raw-args ["--unix-socket" "/var/run/docker.sock"]
                :throw false}))

(defn inspect-container [{:keys [Id]}]
  (curl/get
   (format "http://localhost/containers/%s/json" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn start-container [{:keys [Id]}]
  (curl/post
   (format "http://localhost/containers/%s/start" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

;; check for 204
(defn delete-container [{:keys [Id]}]
  (curl/delete
   (format "http://localhost/containers/%s" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn attach-container [{:keys [Id]}]
  ;; logs is true (as opposed to stream=true) so we run this after the container has stopped
  ;; TTY is true above so this is the just the raw data sent to the PTY (not multiplexed)
  (curl/post
   (format "http://localhost/containers/%s/attach?stdout=true&logs=true" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn attach-container-stdout-logs [{:keys [Id]}]
  ;; this assumes no Tty so the output will be multiplexed back
  (curl/post
   (format "http://localhost/containers/%s/attach?stdout=true&logs=true" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :as :bytes
    :throw false}))

;; should be 200 and then will have a StatusCode
(defn wait-container [{:keys [Id]}]
  (curl/post
   (format "http://localhost/containers/%s/wait?condition=not-running" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn kill-container [{:keys [Id]}]
  (curl/post
   (format "http://localhost/containers/%s/kill" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

(defn ->json [response]
  (json/parse-string (:body response) keyword))

(defn status? [code s]
  (fn [response]
    (if (= code (:status response))
      response
      (throw (ex-info (format "%s -- (%d != %s)" s (:status response) code) response)))))

(def is-logged-in? (comp ->json (status? 200 "backend-is-logged-in") backend-is-logged-in?))
(def get-token (comp ->json (status? 200 "backend-get-token") backend-get-token))
(def get-login-info (comp ->json (status? 200 "backend-login-info") backend-login-info))
(def create (comp ->json (status? 201 "create-container") create-container))
(def thread-volume (comp (status? 201 "create-volume") create-volume))
(def delete-thread-volume (comp (status? 204 "remove-volume") remove-volume))
(def inspect (comp ->json (status? 200 "inspect container") inspect-container))
(def start (comp (status? 204 "start-container") start-container))
(def wait (comp (status? 200 "wait-container") wait-container))
(def attach (comp (status? 200 "attach-container") attach-container))
(def delete (comp (status? 204 "delete-container") delete-container))
(def get-archive (comp (status? 200 "container->archive") container->archive))
(def pull (comp (status? 200 "pull-image") pull-image))
(def images (comp ->json list-images))

(def sample {:image "docker/lsp:latest"
             :entrypoint "/app/result/bin/docker-lsp"
             :command ["project-facts"
                       "--vs-machine-id" "none"
                       "--workspace" "/docker"]})

(spec/def ::host-dir string?)
(spec/def ::entrypoint string?)
(spec/def ::user string?)
(spec/def ::jwt string?)
(spec/def ::image string?)
(spec/def ::command (spec/coll-of string?))
(spec/def ::container-definition (spec/keys :opt-un [::host-dir ::entrypoint ::command ::user ::jwt]
                                            :req-un [::image]))

(spec/def ::pty-output string?)
(spec/def ::exit-code integer?)
(spec/def ::info any?)
(spec/def ::done #{:timeout :exited})
(spec/def ::timeout integer?)
(spec/def ::kill-container any?)

(spec/def ::container-response (spec/keys :req-un [::pty-output ::exit-code ::info ::done]
                                          :opt-un [::timeout ::kill-container]))

(defn- -pull [m]
  (pull (merge m
               {:serveraddress "https://index.docker.io/v1/"}
               (when (and (:user m)
                          (or (:jwt m) (:pat m)))
                 {:creds {:username (:user m)
                          :password (or (:jwt m) (:pat m))}}))))

(defn has-image? [image]
  (let [[_ digest] (re-find #".*@(.*)" image)]
    (some
     (fn [{:keys [RepoTags Id]}]
       (or
        (some #(= % image)  RepoTags)
        (and digest (= digest Id))))
     (images {}))))

(defn run-function
  "run container function with no stdin"
  [{:keys [timeout] :or {timeout 600000} :as m}]
  (when (not (has-image? (:image m)))
    (-pull m))
  (let [x (create m)
        finished-channel (async/promise-chan)]
    (start x)
    ;; timeout process
    (async/go
      (async/<! (async/timeout timeout))
      (async/>! finished-channel {:timeout timeout
                                  :done :timeout
                                  :kill-container (kill-container x)}))
    ;; watch the container
    (async/go
      (wait x)
      (async/>! finished-channel {:done :exited}))

    ;; body is raw PTY output
    (let [finish-reason (async/<!! finished-channel)
          s (:body (attach x))
          info (inspect x)]
      (delete x)
      (merge
       finish-reason
       {:pty-output s
        :exit-code (-> info :State :ExitCode)
        :info info}))))

(defn write-stdin [container-id content]
  (let [buf (ByteBuffer/allocate (* 1024 20))
        address (UnixDomainSocketAddress/of "/var/run/docker.sock")
        client (SocketChannel/open address)]

    ;;(while (not (.finishConnect client)))

    (.configureBlocking client true)
    (.clear buf)
    (.put buf (.getBytes (String. (format "POST /containers/%s/attach?stdin=true&stream=true HTTP/1.1\n" container-id))))
    (.put buf (.getBytes (String. "Host: localhost\nConnection: Upgrade\nUpgrade: tcp\n\n")))
    (try
      (.put ^ByteBuffer buf (.getBytes ^String content))
      (.flip ^ByteBuffer buf)
      (while (.hasRemaining buf)
        (.write client buf))
      (catch Throwable _
        client))
    client))

(defn docker-stream-format->stdout [bytes]
  ;; use xxd to look at the bytes
  #_(try
      (with-open [w (java.io.BufferedOutputStream.
                     (java.io.FileOutputStream. "hey.txt"))]
        (.write w bytes))

      (catch Throwable t
        (println t)))
  (try
    (String. ^bytes (Arrays/copyOfRange ^bytes bytes 8 (count bytes)))
    (catch Throwable t
      (println t)
      "")))

(defn function-call-with-stdin [m]
  (when (not (has-image? (:image m)))
    (-pull m))
  (let [x (merge
           m
           (create (assoc m
                          :opts {:StdinOnce true
                                 :OpenStdin true
                                 :AttachStdin true})))]
    (start x)
    (assoc x :socket (write-stdin (:Id x) (:content m)))))

(defn finish-call
  "This is a blocking call that waits for the container to finish and then returns the output and exit code."
  [{:keys [timeout] :or {timeout 10000} :as x}]
  ;; close stdin socket
  (.close ^SocketChannel (:socket x))
  ;; timeout process
  (let [finished-channel (async/promise-chan)]
    (async/go
      (async/<! (async/timeout timeout))
      (async/>! finished-channel {:timeout timeout
                                  :done :timeout
                                  :kill-container (kill-container x)}))
    ;; watch the container
    (async/go
      (wait x)
      (async/>! finished-channel {:done :exited}))
    ;; body is raw PTY output
    (try
      (let [finish-reason (async/<!! finished-channel)
            s (docker-stream-format->stdout
               (:body
                (attach-container-stdout-logs x)))
            info (inspect x)]
        (delete x)
        (merge
         finish-reason
         {:pty-output s
          :exit-code (-> info :State :ExitCode)
          :info info}))
      (catch Throwable _
        (delete x)
        {}))))

(defn run-with-stdin-content
  "run container with stdin read from a file"
  [m]
  (let [x (docker/function-call-with-stdin
           (assoc m :content (slurp (-> m :stdin :file))))]
    (async/<!! (async/thread
                 (Thread/sleep 10)
                 (docker/finish-call x)))))

(defn run-container
  " params ::container-definition
     returns ::container-response"
  [m]
  (if (-> m :stdin :file)
    (run-with-stdin-content m)
    (run-function m)))

(defn get-login-info-from-desktop-backend
  "returns token or nil if not logged in or backend.sock is not available"
  []
  (try
    (when (is-logged-in? {})
      (merge
       {:is-logged-in? true}
       (try
         (get-login-info {})
         (catch Throwable _))))
    (catch Throwable _)))

(comment

  (is-logged-in? {})
  (get-token {})
  (get-login-info {})
  (get-login-info-from-desktop-backend)
  (images {})

  (pprint
   (json/parse-string
    (run-container
     (assoc sample
            :host-dir "/Users/slim/docker/genai-stack"
            :user "jimclark106")) keyword))
  (docker/delete-image {:image "vonwig/go-linguist:latest"})
  (pprint
   (run-container {:image "vonwig/go-linguist:latest"
                   :timeout 100
                   :command ["-json"]
                   :host-dir "/Users/slim/docker/labs-make-runbook"
                   :user "jimclark106"}))
  (pprint
   (json/parse-string
    (run-container
     {:image "vonwig/extractor-node:latest"
      :host-dir "/Users/slim/docker/labs-make-runbook"})
    keyword)))


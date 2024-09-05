(ns docker
  (:require
   [babashka.curl :as curl]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.pprint :refer [pprint]]
   [clojure.spec.alpha :as spec]
   [clojure.string :as string]
   [creds])
  (:import
   [java.net UnixDomainSocketAddress]
   [java.nio ByteBuffer]
   [java.nio.channels SocketChannel]
   [java.util Arrays Base64]))

(defn encode [to-encode]
  (.encodeToString (Base64/getEncoder) (.getBytes to-encode)))

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
(defn create-container [{:keys [image entrypoint command host-dir env thread-id opts] :or {opts {:Tty true}}}]
  (let [payload (json/generate-string
                 (merge
                  {:Image image}
                  opts
                  (when env {:env (->> env
                                       (map (fn [[k v]] (format "%s=%s" (name k) v)))
                                       (into []))})
                  (when host-dir {:HostConfig
                                  {:Binds
                                   (concat [(format "%s:/project:rw" host-dir)
                                            "docker-lsp:/docker-lsp"]
                                           (when thread-id [(format "%s:/thread:rw" thread-id)]))}
                                  :WorkingDir "/project"})
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
(spec/def ::pat string?)
(spec/def ::image string?)
(spec/def ::command (spec/coll-of string?))
(spec/def ::container-definition (spec/keys :opt-un [::host-dir ::entrypoint ::command ::user ::pat]
                                            :req-un [::image]))

(defn run-function [{:keys [timeout] :or {timeout 600000} :as m}]
  (pull (merge m
               {:serveraddress "https://index.docker.io/v1/"}
               (let [jwt (creds/credential-helper->jwt)]
                 (when (and (:user m)
                            (or (:pat m) jwt))
                   {:creds {:username (:user m)
                            :password (or (:pat m) jwt)}}))))
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

(def extract-facts run-function)

(defn write-stdin [container-id content]
  (let [buf (ByteBuffer/allocate 1024)
        address (UnixDomainSocketAddress/of "/var/run/docker.sock")
        client (SocketChannel/open address)]

    ;;(while (not (.finishConnect client)))

    (.configureBlocking client true)
    (.clear buf)
    (.put buf (.getBytes (String. (format "POST /containers/%s/attach?stdin=true&stream=true HTTP/1.1\n" container-id))))
    (.put buf (.getBytes (String. "Host: localhost\nConnection: Upgrade\nUpgrade: tcp\n\n")))
    (.put buf (.getBytes content))
    (.flip buf)

    (while (.hasRemaining buf)
      (.write client buf))
    client))

(defn docker-stream-format->stdout [bytes]
  ;; use xxd to look at the bytes
  #_(try
    (with-open [w (java.io.BufferedOutputStream. 
                    (java.io.FileOutputStream. "hey.txt"))]
     (.write w bytes))
    
    (catch Throwable t
      (println t)))
  (String. (Arrays/copyOfRange bytes 8 (count bytes))))

(defn function-call-with-stdin [m]
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
  [x]
  (.close (:socket x))
  (wait x)
     ;; body is raw PTY output
     (let [s (docker-stream-format->stdout 
               (:body 
                 (attach-container-stdout-logs x)) )
        info (inspect x)]
    (delete x)
    {:pty-output s
     :exit-code (-> info :State :ExitCode)
     :info info}))

(comment

  (pprint
   (json/parse-string
    (extract-facts
     (assoc sample
            :host-dir "/Users/slim/docker/genai-stack"
            :user "jimclark106")) keyword))
  (docker/delete-image {:image "vonwig/go-linguist:latest"})
  (pprint
    (extract-facts {:image "vonwig/go-linguist:latest"
                    :timeout 100
                    :command ["-json"]
                    :host-dir "/Users/slim/docker/labs-make-runbook"
                    :user "jimclark106"}))
  (pprint
   (json/parse-string
    (extract-facts
     {:image "vonwig/extractor-node:latest"
      :host-dir "/Users/slim/docker/labs-make-runbook"})
    keyword)))


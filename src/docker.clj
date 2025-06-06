(ns docker
  "run-container runs containers with a few flavors
     - run with stdin content
     - run a container but don't wait for it to stop
     - run in the background but wait for one message on stdout and then stop
     - simply run function without stdin
  
   attach-socket - to running container
   write-stdin - 
   read-loop - input: attached socket output: channel messages
   write-to-stdin -input: attached socket, string
   inject-secret-transform - transform container entrypoint for secrets
   
   run-streaming-function-with-no-stdin - runs continuously
     and read stdout to a callback (used in watcher)"
  (:require
   [babashka.curl :as curl]
   [babashka.fs :as fs]
   [cheshire.core :as json]
   [clojure.core.async :as async]
   [clojure.java.io :as io]
   [clojure.string :as string]
   [creds]
   jsonrpc
   [jsonrpc.logger :as logger]
   logging
   repl
   schema
   shutdown)
  (:import
   [java.io BufferedReader PipedInputStream PipedOutputStream]
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
    {:raw-args ["--unix-socket" (let [f (fs/file "/var/run/docker.raw.sock")]
                                  (if (.exists f)
                                    "/var/run/docker.raw.sock"
                                    "/var/run/docker.sock"))]
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
  (let [coll [(or (System/getenv "DOCKER_DESKTOP_SOCKET_PATH") "/backend.sock")
              (format "%s/Library/Containers/com.docker.docker/Data/backend.sock" (System/getenv "HOME"))]]
    (some unix-socket-file coll)))

(defn- get-jfs-socket []
  (let [coll [(or (System/getenv "JFS_SOCKET_PATH") "/jfs.sock")
              (format "%s/Library/Containers/com.docker.docker/Data/jfs.sock" (System/getenv "HOME"))]]
    (some unix-socket-file coll)))

(defn jfs-get-secret [s]
  (curl/get
   (format "http://localhost/secrets/%s" s)
   {:raw-args ["--unix-socket"  (get-jfs-socket)]
    :throw false}))

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

(defn backend-get-version [_]
  (curl/get
   "http://localhost/versions"
   {:raw-args ["--unix-socket" (get-backend-socket)]
    :throw false}))

(comment
  (let [pat (string/trim (slurp "/Users/slim/.secrets/dockerhub-pat-ai-tools-for-devs.txt"))]
    (pull-image {:image "vonwig/go-linguist:latest"
                 :creds {:username "jimclark106"
                         :password pat
                         :serveraddress "https://index.docker.io/v1/"}})))

(defn list-containers [m]
  (curl/get
   "http://localhost/containers/json"
   {:raw-args ["--unix-socket" (let [f (fs/file "/var/run/docker.raw.sock")
                                     macos (fs/file (format "%s/Library/Containers/com.docker.docker/Data/docker.raw.sock" (System/getenv "HOME")))]
                                 (cond (.exists f) "/var/run/docker.raw.sock"
                                       (.exists macos) (format "%s/Library/Containers/com.docker.docker/Data/docker.raw.sock" (System/getenv "HOME"))
                                       :else "/var/run/docker.sock"))]
    :throw false
    :query-params {:filters (json/generate-string m)
                   :all "true"}}))

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

(defn parse-port [s]
  (let [[_ host container] (re-find #"(.*):(.*)" s)]
    {:host {:port host}
     :container {:port container
                 :protocol "tcp"}}))

(defn exposed-ports
  "  params
       - coll of strings (e.g. [\"9222:9222\"])"
  [coll]
  (->> (for [s coll :let [{:keys [container]} (parse-port s)]]
         [(format "%s/%s" (:port container) (:protocol container)) {}])
       (into {})))

(defn port-bindings
  "  params
       - coll of strings (e.g. [\"9222:9222\"])"
  [coll]
  (->>
   (for [s coll :let [{:keys [container host]} (parse-port s)]]
     [(format "%s/%s" (:port container) (:protocol container)) [{:HostPort (:port host)}]])
   (into {})))

;; check for 201
;; entrypoint is an array of strings
;; env is a map
;; Env is an array of name=value strings
;;
;; opts
;;
;; Tty wraps the process in a pseudo terminal
;; StdinOnce closes the stdin after the first client detaches
;; OpenStdin just opens stdin
(declare secrets-get)
(defn create-container [{:keys [image entrypoint workdir command host-dir
                                environment thread-id opts mounts volumes
                                ports network_mode secrets labels]
                         :or {opts {:Tty true}}
                         :as m}]
  (let [payload (json/generate-string
                 (merge
                  {:Image image}
                  opts
                  (when environment
                    {:Env (->> environment
                               (map (fn [[k v]] (format "%s=%s" (name k) v)))
                               (into []))})
                  {:Labels  (->> (concat
                                  (->> secrets
                                       keys
                                       (mapcat (fn [secret-key]
                                                 (let [s (name secret-key)]
                                                   (when (secrets-get (name secret-key))
                                                     [[(format "x-secret:%s" s) (string/trim (format "/secret/%s" s))]])))))
                                  (seq labels))
                                 (into {}))}
                  {:HostConfig
                   (merge
                    {:Binds
                     (concat
                      (when host-dir [(format "%s:/project:rw" host-dir)])
                      (when thread-id [(format "%s:/thread:rw" thread-id)])
                      (or volumes mounts))}
                    (when network_mode
                      {:NetworkMode network_mode})
                    (when ports
                      {:PortBindings (port-bindings ports)}))
                   :WorkingDir (or workdir "/project")}
                  (when ports {:ExposedPorts (exposed-ports ports)})
                  (when entrypoint {:Entrypoint entrypoint})
                  (when command {:Cmd command})))
        ascii-payload (String. (.getBytes payload "ASCII"))]
    (curl/post
     (format
      "http://localhost/containers/create%s"
      (if (:name m) (format "?name=%s" (:name m)) ""))
     {:raw-args ["--unix-socket" "/var/run/docker.sock"]
      :throw false
      :body ascii-payload
      :headers {"Content-Type" "application/json"
                "Content-Length" (count ascii-payload)}})))

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

(defn inspect-image [{:keys [Name Id]}]
  (curl/get
   (format "http://localhost/images/%s/json" (or Name Id))
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

;; container was created with a Terminal (output is not-multiplexed)
;; use after the container has stopped (not streaming)
(defn attach-container [{:keys [Id]}]
  ;; logs is true (as opposed to stream=true) so we run this after the container has stopped
  ;; TTY is true above so this is the just the raw data sent to the PTY (not multiplexed)
  (curl/post
   (format "http://localhost/containers/%s/attach?stdout=true&logs=true" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :throw false}))

;; container was created without a Terminal (output is multiplexed so read as bytes)
(defn attach-container-stdout-logs [{:keys [Id]}]
  ;; this assumes no Tty so the output will be multiplexed back
  (curl/post
   (format "http://localhost/containers/%s/attach?stdout=true&stderr=true&logs=true" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :as :bytes
    :throw false}))

;; container must be created with a Terminal (so we can stream with a Reader)
(defn attach-container-stream-stdout [{:keys [Id]}]
  (curl/post
   (format "http://localhost/containers/%s/attach?stderr=false&stdout=true&stream=true" Id)
   {:raw-args ["--unix-socket" "/var/run/docker.sock"]
    :as :stream
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

(defn stop-container [{:keys [Id]}]
  (curl/post
   (format "http://localhost/containers/%s/stop" Id)
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
(def get-versions (comp ->json (status? 200 "backend-get-versions") backend-get-version))
(def create (comp ->json (status? 201 "create-container") create-container))
(def thread-volume (comp (status? 201 "create-volume") create-volume))
(def delete-thread-volume (comp (status? 204 "remove-volume") remove-volume))
(def inspect (comp ->json (status? 200 "inspect container") inspect-container))
(def image-inspect (comp ->json (status? 200 "inspect image") inspect-image))
(def start (comp (status? 204 "start-container") start-container))
(def wait (comp (status? 200 "wait-container") wait-container))
(def attach (comp (status? 200 "attach-container") attach-container))
(def delete (comp (status? 204 "delete-container") delete-container))
(def get-archive (comp (status? 200 "container->archive") container->archive))
(def pull (comp (status? 200 "pull-image") pull-image))
(def images (comp ->json list-images))
(def containers (comp ->json (status? 200 "list-containers") list-containers))
(def secrets-get (comp ->json (status? 200 "secrets-get") jfs-get-secret))

(defn add-latest [image]
  (let [[_ tag] (re-find #".*(:.*)$" image)]
    (if tag
      image
      (str image ":latest"))))

(defn -pull [m]
  (pull (merge m
               {:image (add-latest (:image m))}
               {:serveraddress "https://index.docker.io/v1/"}
               (when (and (:user m)
                          (or (:jwt m) (:pat m)))
                 {:creds {:username (:user m)
                          :password (or (:jwt m) (:pat m))}}))))

(defn -add-token [m]
  (merge
   m
   (try
     (when (is-logged-in? m)
       {:jwt (get-token m)
        :user (:id (get-login-info m))})
     (catch Throwable _
       (logger/warn "user is not logged in to Docker Destkop")))))

(defn has-image? [image]
  (let [[_ digest] (re-find #".*@(.*)" image)]
    (try
      (image-inspect (if digest {:Id digest} {:Name image}))
      (catch Throwable _))))

(defn check-then-pull [container-definition]
  (when (not (has-image? (:image container-definition)))
    (logger/info "pulling image " (:image container-definition))
    ((comp -pull -add-token) container-definition)))

(defn injected-entrypoint [secrets environment s]
  (->> (concat
        (let [s (->> secrets
                     (map (fn [[k v]]
                            (format "export %s=$(cat /secret/%s | sed -e \"s/^[[:space:]]*//\")" v (name k))))
                     (string/join " ; "))]
          (when (and s (not (= "" s)))
            [s]))
        (let [env (->> environment
                       (map (fn [s] (when-let [[_ k v] (and s (re-find #"(.*)=(.*)" s))]
                                      [k v])))
                       (filter identity)
                       (map (fn [[k v]]
                              (format "export %s=%s" k v)))
                       (string/join " ; "))]
          (when (and env (not (= "" env)))
            [env]))
        [s])
       (string/join " ; ")))

(defn get-secrets [{:keys [secrets]}]
  (->> secrets
       (map (fn [[k v]]
              [v (:value (secrets-get (name k)))]))
       (into {})))

(defn inject-secret-transform [container-definition]
  (check-then-pull container-definition)
  (let [{:keys [Entrypoint Cmd Env User]}
        (->
         (image-inspect {:Name (:image container-definition)})
         :Config)
        real-entrypoint (string/join " " (concat
                                          (or (:entrypoint container-definition) Entrypoint)
                                          (or (:command container-definition) Cmd)))]
    (if (#{"" "root"} User)
      (-> container-definition
          (assoc :entrypoint ["/bin/sh" "-c" (injected-entrypoint
                                              (:secrets container-definition)
                                              (concat
                                               Env
                                               (->> (:environment container-definition)
                                                    (map (fn [[k v]] (format "%s=%s" (if (keyword? k) (name k) k) v)))
                                                    (into [])))
                                              real-entrypoint)])
          (dissoc :command))
      (-> container-definition
          (update :environment (fnil merge {}) (get-secrets container-definition))))))

(defn run-streaming-function-with-no-stdin
  "run container function with no stdin, and no timeout, but streaming stdout"
  [m cb]
  (check-then-pull m)
  (let [x (-> m
              (update :opts
                      (fnil merge {})
                      {:Tty true
                       :StdinOnce false
                       :OpenStdin false
                       :AttachStdin false})
              (create))
        finished-channel (async/promise-chan)]
    (start x)

    (.start ^Thread
     (Thread.
      (fn []
        (try
          (let [s (:body (attach-container-stream-stdout x))]
            (doseq [line (line-seq (java.io.BufferedReader. (java.io.InputStreamReader. s)))]
              (cb line)))
          (catch Throwable e
            (logger/error "run-streaming-function" e))))))

    ;; watch the container
    (.start ^Thread
     (Thread.
      (fn []
        (wait x)
        (async/put! finished-channel {:done :exited}))))

    {:container x
     ;; stopped channel
     :stopped (async/go
                ;; body is raw PTY output
                (let [finish-reason (async/<!! finished-channel)
                      s (:body (attach x))
                      info (inspect x)]
                  (delete x)
                  (merge
                   finish-reason
                   {:pty-output s
                    :exit-code (-> info :State :ExitCode)
                    :info info})))}))

(defn run-background-function
  "run container function with no stdin, and no streaming output"
  [m]
  (check-then-pull m)
  (let [x (create m)]
    (start x)
    (shutdown/schedule-container-shutdown
     (fn []
       (kill-container x)
       (delete x)))
    {:done :running
     :pty-output (str "started up Ts" (:image m))}))

(defn run-function
  "run container function with no stdin, and no streaming output"
  [{:keys [timeout] :or {timeout 600000} :as m}]
  (check-then-pull m)
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

;; not curl - opens a real socket to write to the container stdin
;;  returns the open socket - closing the socket will signal the program to finish
;;          if it's waiting on input
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
      (catch Throwable ex
        (logger/error "write-stdin error " ex)
        client))
    client))

(defn get-block [x-bytes start]
  (let [[type _ _ _ n1 n2 n3 n4] (Arrays/copyOfRange ^bytes x-bytes ^int start ^int (+ start 8))]
    (let [size (.getInt (ByteBuffer/wrap (Arrays/copyOfRange ^bytes x-bytes ^int (+ start 4) ^int (+ start 8))))]
      [(case (int type) 0 :stdin 1 :stdout 2 :stderr)
       size
       (String. (Arrays/copyOfRange ^bytes x-bytes ^int (+ start 8) ^int (+ start 8 size)))])))

(defn process-bytes [x-bytes]
  (loop [agg {:stdout "" :stderr "" :stdin ""} start 0]
    (if (> (- (count x-bytes) start) 8)
      (let [[type size s] (get-block x-bytes start)]
        (recur
         (update agg type str s)
         (long (+ start size 8))))
      agg)))

(defn docker-stream-format->stdout [bytes]
  (try
    (let [{:keys [stdout stderr]} (process-bytes bytes)]
      (str stdout stderr))
    (catch Throwable t
      (logger/error "processing docker engine attach bytes: " t)
      "")))

(defn write-to-stdin
  "  params
       client - SocketChannel for attached container"
  [client s]
  (let [buf (ByteBuffer/allocate (* 1024 20))]
    (.clear ^ByteBuffer buf)
    (try
      (.put ^ByteBuffer buf (.getBytes ^String s))
      (.flip ^ByteBuffer buf)
      (while (.hasRemaining buf)
        (.write ^SocketChannel client buf))
      (catch Throwable t
        (logger/error "write-string error " t)))))

(defn read-loop
  "the socket read loop for the stdout/stderr streams of a container
   de-plexes the streams and writes out blocks of stdout and stderr to a channel

   The channel should eventually close becuase the socket will close when the process exits

    params
       in - SocketChannel for attached container
       c - channel to write multiplexed stdout stderr blocks"
  [in c]
  (try
    (let [header-buf (ByteBuffer/allocate 8)
          stdout (PipedOutputStream.)
          stdout-reader (io/reader (PipedInputStream. stdout))]
      (.start ^Thread
       (Thread.
        (fn []
          (loop []
            (when-let [line (.readLine ^BufferedReader stdout-reader)]
              (async/put! c {:stdout line})
              (recur))))))
      (loop [offset 0]
        (let [result (.read ^SocketChannel in header-buf)]
          (cond
                ;;;;;;;;;; 
            (= -1 result)
            (do
              (.close stdout)
              (async/close! c))

                ;;;;;;;;;;
            (= 8 (+ offset result))

            (let [size (.getInt (ByteBuffer/wrap (Arrays/copyOfRange ^bytes (.array ^ByteBuffer header-buf) 4 8)))
                  stream-type (case (int (nth (.array ^ByteBuffer header-buf) 0))
                                0 :stdin
                                1 :stdout
                                2 :stderr)
                  buf (ByteBuffer/allocate size)]
              (.clear ^ByteBuffer header-buf)
              (loop [offset 0]
                (let [result (.read ^SocketChannel in buf)]
                  (cond
                        ;;;;;;;;;;
                    (= -1 result)
                    (async/close! c)

                        ;;;;;;;;;;
                    (= size (+ offset result))
                    (if (= stream-type :stdout)
                      (do
                        (.write stdout ^bytes (.array buf))
                        (.flush stdout))
                      (async/put! c {stream-type (String. ^bytes (.array buf))}))

                        ;;;;;;;;;;
                    :else
                    (recur (+ offset result)))))

              (.clear ^ByteBuffer buf)
              (recur 0))

                ;;;;;;;;;;
            :else
            (recur (+ offset result))))))
    (catch Throwable t
      (logger/error "streaming exception " t)
      (async/close! c))))

(defn attach-socket
  " returns SocketChannel (upgraded attach connection with all streams active)"
  [container-id]
  (let [buf (ByteBuffer/allocate (* 1024 20))
        address (UnixDomainSocketAddress/of "/var/run/docker.sock")
        client (SocketChannel/open address)]
    (.configureBlocking client true)
    (.clear buf)
    ;; make HTTP call
    (.put buf (.getBytes (String. (format "POST /containers/%s/attach?stdin=true&stdout=true&stderr=true&stream=true HTTP/1.1\n" container-id))))
    (.put buf (.getBytes (String. "Host: localhost\nConnection: Upgrade\nUpgrade: tcp\n\n")))
    (try
      (.flip ^ByteBuffer buf)
      (while (.hasRemaining buf)
        (.write client buf))
      ;; TODO if successful, we should get a 101 UPGRADED response that will be exactly 117 bytes
      (let [buf (ByteBuffer/allocate 117)]
        ;; TODO read the HTTP upgrade message
        (loop [size 0]
          (let [result (.read client buf)
                bytes-read (+ size result)]
            (when (not (= 117 bytes-read))
              (recur bytes-read)))))
      (catch Throwable _
        client))
    client))

(defn function-call-with-stdin
  "creates and starts container, then writes to stdin process
     returns container map with Id, and socket - socket is open socket to stdin"
  [m]
  (check-then-pull m)
  (let [x (merge
           m
           (create (assoc m
                          :opts {:StdinOnce true
                                 :OpenStdin true
                                 :AttachStdin true})))]
    (start x)
    (assoc x :socket (write-stdin (:Id x) (:content m)))))

(defn function-call-with-attached-socket
  "create and start a container with an attached socket
   this does not wait for the container to finish
    returns a map with an 
      :output-channel for stdout/stderr/:stopped/:timeout/:closed messages
      :write function to write to the stdin of the container"
  [container]
  (check-then-pull container)
  (let [x (docker/create (assoc container
                                :opts {:StdinOnce true
                                       :OpenStdin true
                                       :AttachStding true}))
        socket-channel (attach-socket (:Id x))
        c (async/chan)
        output-channel (async/chan)]
    (start x)
    (.start ^Thread
     (Thread.
      (fn []
        (read-loop socket-channel c))))
    (async/go
      (docker/wait x)
      (async/>! c :stopped)
      (delete x))
    (async/go-loop
     [block (async/<! c)]
      (cond
        (#{:stopped :timeout} block)
        (async/put! output-channel block)
        (nil? block)
        (async/put! output-channel :closed)
        :else
        (do
          (async/put! output-channel block)
          (recur (async/<! c)))))
    (assoc
     x
     :output-channel output-channel
     :write (fn [s] (write-to-stdin socket-channel s)))))

(defn finish-call
  "Waits (blocking) for call to container to finish, retrieves stdout logs
    params 
      running container
    returns ::container-response"
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
    ;; body is raw PTY output - could we 
    ;;   have just been reading from the socket since it's two way?
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

(defn run-in-background-with-one-message [m]
  (let [{:keys [output-channel]} (function-call-with-attached-socket m)]
    (async/go-loop
     []
      (let [m (async/<! output-channel)]
        (cond
          (#{:timeout} m)
          {:done :timeout :timeout "timeout waiting for message"}
          (#{:stopped :closed} m)
          {:done :exited :pty-output "tool stopped before responding on stdout" :exit-code 1}
          (and (map? m) (contains? m :stdout))
          {:pty-output (:stdout m)
           :done :running}
          :else
          (do
            (logger/info "background stderr " m)
            (recur)))))))

(defn run-with-stdin-content
  "run container with stdin read from file or from string
   this is several engine calls
     - create container
     - start container
     - write-stdin which creates a socket, upgrades the connection, and writes the bytes
     - closes the socket
     - wait for container to exit or kill it if there's a timeout
     - attaches to the container and downloads the bytes for both the stdout and stderr
     - deletes the container"
  [m]
  (let [x (docker/function-call-with-stdin
           (assoc m :content (or
                              (-> m :stdin :content)
                              (slurp (-> m :stdin :file)))))]
    (async/<!! (async/thread
                 (Thread/sleep 10)
                 (docker/finish-call x)))))

(defn run-container
  " params ::container-definition
     returns ::container-response"
  [m]
  ;; (schema/validate :schema/tool-container)
  (cond
    (-> m :stdin)
    (run-with-stdin-content m)
    (true? (:background m))
    (run-background-function m)
    (true? (:background-callback m))
    (async/<!! (run-in-background-with-one-message m))
    :else
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


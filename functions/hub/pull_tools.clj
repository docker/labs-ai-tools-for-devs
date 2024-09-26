(ns pull-tools
  (:require
   [babashka.fs :as fs]
   [babashka.process :as process]
   [clojure.pprint :as pprint]
   [clojure.string :as string]
   [selmer.parser :as selmer]))

(def new-ones
  "fd")

(def dumb

  "docker-gc"

  )

(def not-working
  [;; swiftformat requires a license and a Developer Tool install on macos
   "swiftformat"
   "swiftlint"


   


   ;; marked broken
   "nix-linter"

   ;; what
   "go-critic"
   "regal" ;; Rego
   "textlint"
   "formatjson5"
   "commitmsgfmt"])

(def complicated
  [
   ;; rust 
   ;; provides clippy-driver and cargo-clippy
   "clippy"

   ;; requires go
   ;; provides staticcheck ast-to-pattern structlayout irdump keyify gosmith
   ;;          structlayout-optimize gogrep unused structlayout-pretty
   "go-tools"

   ;; provides rg
   "ripgrep"

   ;; provides aws aws_completer
   ;; also `aws help` produces man page but `man aws` does not work
   "awscli2"

   ;; provides az azps.ps1
   "azure-cli"


   ;; provides lua-format
   "luaformatter"


   ;; requires nix-shell in container
   "nixpkgs-lint"

   ;; no explicit help menu - you call it with bad args and read 
   ;; the help menu off stderr
   "hclfmt"
   "fop" ;; xml formatter
   "dockfmt"

   ;; just doesn't have any help
   "fixup_yarn_lock"

   ;; is a nixos system package
   "github-runner"]
  ) 


  (def lint-tools
    ["gh"
     "pylint"
     "commitlint"
     "scalafix"
     "gitlint"
     "yamllint"
     "checkmake"
     "gqlint"
     "sqlint"
     "golint"
     "golangci-lint"
     "hadolint"
     "markdownlint-cli2"
     "cargo-toml-lint"
     "ruff"
     "dockle" ;; container security linter
     "clj-kondo"
     "selene" ;; lua linter
     "tflint" ;; terraform linter
     "rslint"
     "yapf"
     "puppet-lint"
     "oxlint"
     "kube-linter"
     "csslint"
     "cpplint"
     "ansible-lint"
     "actionlint"
     "black"
     "checkov"
     "jfmt"
     "datefmt"
     "rustfmt"
     "cbfmt" ;; format codeblocks inside of markdown files
     "yamlfmt"
     "whatstyle"
     "rufo"
     "fnlfmt" ;; fennel formatter
     "shfmt"
     "zprint"
     "jet"
     "typos"])

(def docker-tools
  [
   "docker-ls"
   "nerdctl"
   "diffoci"
   "dive"
   "kompose"
   ])

(def fix-tools
  [
   "git-test"])

(def clouds
  [
   "kubectl"
   "fastly"
   "infracost"])

(def misc-tools
  ["sops"
   "curl"
   "fzf"
   "ffmpeg"
   "babl"
   "unzip"
   "jq"
   "graphviz"
   "pstree"
   "figlet"
   "toilet"
   "tldr" ;; man page examples
   "qrencode" 
   ])

;; clippy
;; go-tools
;; nixpkgs-linter
;; datefmt
;; hclfmt
;; fop
;; luaformatter
;; ripgrep
;; docker-gc
;; dockfmt
;; fixup_yarn_lock
;; undocker
;; dnstracer
;; github-runner
;; jkk
;; awscli2
;; azure-cli
;; github-runner
;; dnstracer

(+
 (count lint-tools)
 (count docker-tools)
 (count fix-tools)
 (count clouds)
 (count misc-tools))

(def all-tools (concat lint-tools docker-tools fix-tools clouds misc-tools))

(defn generate [t]
  (let [flake-template (slurp "flake.nix.template")
        init-clj-template (slurp "init.clj.template")]
    (try (fs/create-dir t) (catch Throwable t))
    (try (fs/copy "flake.lock.template" (fs/file t "flake.lock") {:replace-existing true}) (catch Throwable t))
    (try (fs/copy "Dockerfile.template" (fs/file t "Dockerfile") {:replace-existing true}) (catch Throwable t))
    (try
      (spit (fs/file t "flake.nix") (selmer/render flake-template {:tool t}))
      (catch Throwable t
        (println (format "error with flake.nix in %s" t))))
    (try
      (spit (fs/file t "init.clj") (selmer/render init-clj-template {:tool t}))
      (catch Throwable t
        (println (format "error with flake.nix in %s" t))))))

;; qrencode
;; curl
;; toilet
;; figlet

;; gh
;; typos
;; fzf
;; jq
;; fmpeg



;; pylint ruff
;; gitlint, commitlint
;; yamllint
;; checkmake
;; gqlint
;; sqlint
;; clj-kondo
;; tflint
;; rslint
;; kube-linter
;; actionlint
;; jfmt
;; datefmt
;; yamlfmt
;; whatstyle
;; fnlfmt
;; yapt yet another python formatter
;; shfmt
;; jet
;; typos
;; docker-ls
;; ffmpeg
;; fzf
;; curl
;; jq
;; figlet
;; toilet
;; tldr
;; selene - data integration?

(defn find-help []
  (->>
    (for [t all-tools]
      [t
       (let [p @(process/process
                  {:out :string}
                  (format "docker run --rm vonwig/%s '{\"args\": \"--help\"}'" t))]
         (:exit p))
       (let [p @(process/process
                  {:out :string}
                  (format "docker run --rm vonwig/%s '{\"args\": \"-h\"}'" t))]
         (:exit p))
       (let [p @(process/process
                  {:out :string}
                  (format "docker run --rm vonwig/%s '{}' man" t))]
         (:exit p))])
    (map (fn [coll]
           (string/join "," coll)))))

(comment

  (generate "fd")

  (doseq [t all-tools]
    (generate t))

  ;; Build image
  (doseq [t all-tools]
    (println t)
    (let [p @(process/process
              {:out :string :err :string :dir (fs/file t)}
              (format "docker build -t %s ." (format "vonwig/%s" t)))]
      (when-not (= 0 (:exit p))
        (println (format "**** %s ****\n\n" t))
        (println (:err p)))))

  ;; do we have some form of help somehow
  (def x (find-help))
  (->> x
       (map (fn [s] (string/split s #",")))
       (filter (complement (fn [r] (some #(= "0" %) (drop 1 r))))))

  (def help-data
    (->>
      (for [t all-tools]
        [[:name t]
         (let [p @(process/process
                    {:out :string}
                    (format "docker run --rm vonwig/%s '{}' man" t))]
           [:man (:out p)])])))
  (spit "help-data.clj" (pr-str help-data))

  (pprint/pprint help-data)
  
  )

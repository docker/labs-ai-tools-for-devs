(ns pull-tools)

(def lint-tools
  ["gh"
   "pylint"
   "commitlint"
   "scalafix"
   "gitlint"
   "swiftformat"
   "checkmake"
   "gqlint"
   "sqlint"
   "yamlint"
   "golint"
   "golangci-lint"
   "go-critic"
   "clippy" ;; rust
   "nix-linter"
   "hadolint"
   "markdownlint-cli2"
   "cargo-toml-lint"
   "ruff"
   "regal" ;; Rego
   "dockle" ;; container security linter
   "clj-kondo"
   "textlint"
   "selene" ;; lua linter
   "tflint" ;; terraform linter
   "rslint"
   "go-tools"
   "yapf"
   "swiftlint"
   "puppet-lint"
   "oxlint"
   "nixpkgs-lint"
   "kube-linter"
   "csslint"
   "cpplint"
   "ansible-lint"
   "actionlint"
   "black"
   "checkov"
   "formatjson5"
   "jfmt"
   "datefmt"
   "rustfmt"
   "hclfmt"
   "cbfmt" ;; format codeblocks inside of markdown files
   "luaformatter"
   "yamlfmt"
   "whatstyle"
   "fop"
   "commitmsgfmt"
   "rufo"
   "fnlfmt" ;; fennel formatter
   "shfmt"
   "zprint"
   "jet"
   "typos"])

(def docker-tools
  ["docker-ls"
   "docker-gc"
   "nerdctl"
   "diffoci"
   "dive"
   "undocker"
   "kompose"
   "dockfmt"])

(def fix-tools
  ["fixup-yarn-lock"
   "git-test"])

(def clouds
  ["awscli2"
   "azure-cli"
   "kubectl"
   "fastly"
   "infracost"])

(def misc-tools
  ["sops"
   "github-runner"
   "dnstracer"
   "curl"
   "fzf"
   "ffmpeg"
   "babl"
   "unzip"
   "jq"
   "ripgrep"
   "graphviz"
   "pstree"
   "figlet"
   "toilet"
   "tldr" ;; man page examples
   "ripgrep"])

(+
 (count lint-tools)
 (count docker-tools)
 (count fix-tools)
 (count clouds)
 (count misc-tools))


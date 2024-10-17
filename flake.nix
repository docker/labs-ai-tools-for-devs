{
  description = "The Docker LSP";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # can't update graal right now - this is from Aug '23
    flake-utils.url = "github:numtide/flake-utils";
    clj-nix = {
      url = "github:jlesquembre/clj-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, clj-nix, devshell, ...}@inputs:

    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlays = [
            devshell.overlays.default
            (self: super: {
              clj-nix = clj-nix.packages."${system}";
            })
          ];
          # don't treat pkgs as meaning nixpkgs - treat it as all packages!
          pkgs = import nixpkgs {
            inherit overlays system;
          };

        in
        {
          packages = rec {
            clj = pkgs.clj-nix.mkCljBin {
              name = "agent-graph";
              projectSrc = ./.;
              main-ns = "docker.main";
              buildCommand = "clj -T:build uber";
              jdkRunner = pkgs.jdk17_headless;
            };
            deps-cache = pkgs.clj-nix.mk-deps-cache {
              lockfile = ./deps-lock.json;
            };
            graal = pkgs.clj-nix.mkGraalBin {
              # lazy lookup of a derivation that will exist
              cljDrv = self.packages."${system}".clj;
              graalvmXmx = "-J-Xmx8g";
              graalvm = pkgs.graalvm-ce;
              extraNativeImageBuildArgs = [
                "--native-image-info"
                "--initialize-at-build-time"
                "--enable-http"
                "--enable-https"
              ];
            };

            custom-jdk = pkgs.clj-nix.customJdk {
              cljDrv = clj;
              jdkBase = pkgs.jdk17_headless;
              locales = "en";
              javaOpts = [];
            };

            entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
              export PATH=${pkgs.lib.makeBinPath [pkgs.curl]}
              export OPENAI_API_KEY_LOCATION="/root"
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              ${clj}/bin/agent-graph "$@"
            '';

            default = pkgs.buildEnv {
              name = "agent-graph-env";
              paths = [ entrypoint ];
            };
          };

          devShells.default = pkgs.devshell.mkShell {
            name = "agent-graph-shell";
            packages = with pkgs; [ babashka clojure skopeo ];

            commands = [
              {
                name = "lock-clojure-deps";
                help = "update deps-lock.json whenever deps.edn changes";
                command = "nix run github:jlesquembre/clj-nix#deps-lock";
              }
              {
                name = "start";
                help = "start the lsp server using deps.edn";
                command = "clojure -M:main";
              }
            ];
          };
        });
}

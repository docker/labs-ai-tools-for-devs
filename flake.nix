{
  description = "The Docker LSP";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # can't update graal right now - this is from Aug '23
    flake-utils.url = "github:numtide/flake-utils";
    clj-nix = {
      # for debugging the nix packages
      # url = "path:/Users/slim/slimslenderslacks/clj-nix";
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

            # build uber jar
            clj = pkgs.clj-nix.mkCljBin {
              name = "agent-graph";
              projectSrc = ./.;
              main-ns = "docker.main";
              buildCommand = "clj -T:build uber";
              jdkRunner = pkgs.jdk17_headless;
            };

            # create a minimal java runtime for this uberjar
            custom-jdk = pkgs.clj-nix.customJdk {
              cljDrv = clj;
              jdkBase = pkgs.jdk17_headless;
              # locales = "en";
              javaOpts = [];
              extraJdkModules = ["java.security.jgss" "java.security.sasl" "jdk.crypto.ec"];
            };

            # our application makes calls to the curl binary
            #  therefore, wrap the custom-jdk in a script with curl in the PATH
            entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
              export PATH=${pkgs.lib.makeBinPath [pkgs.curl]}
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              exec ${custom-jdk}/bin/agent-graph "$@"
            '';

            # the final entrypoint
            default = pkgs.buildEnv {
              name = "agent-graph-env";
              paths = [ entrypoint ];
            };
          };

          devShells.default = pkgs.devshell.mkShell {
            name = "agent-graph-shell";
            packages = with pkgs; [ babashka clojure skopeo hugo ];

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

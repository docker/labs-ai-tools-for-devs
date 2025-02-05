{
  description = "tree-sitter";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";

    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    clj-nix = {
      url = "github:jlesquembre/clj-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, ...}@inputs:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlays = [
            inputs.devshell.overlays.default
            (self: super: {
              clj-nix = inputs.clj-nix.packages."${system}";
            })
          ];
          pkgs = import nixpkgs {
            inherit overlays system;
          };

        in rec {
          packages = rec {
            # darwin versus linux
            dylibExt = if nixpkgs.lib.hasInfix "darwin" system then "dylib" else "so";  

            lib = pkgs.stdenv.mkDerivation {
              name = "lib";
              src = ./.;
              installPhase = ''
                mkdir -p $out/lib;
                cp ${pkgs.tree-sitter}/lib/libtree-sitter.${dylibExt} $out/lib/;
                cp ${pkgs.tree-sitter-grammars.tree-sitter-markdown}/parser $out/lib/libtree-sitter-markdown.${dylibExt};
                cp ${pkgs.tree-sitter-grammars.tree-sitter-python}/parser $out/lib/libtree-sitter-python.${dylibExt};
              '';
            };

            clj = pkgs.clj-nix.mkCljBin {
              name = "tree-sitter-clj-bin";
              projectSrc = ./.;
              main-ns = "docker.ts";
              jdkRunner = pkgs.openjdk22;
              java-opts = ["--enable-native-access=ALL-UNNAMED"];
              buildCommand = "clj -T:build uber";
            };
            graal = pkgs.clj-nix.mkGraalBin {
              # lazy lookup of a derivation that will exist
              cljDrv = self.packages."${system}".clj;
              graalvmXmx = "-J-Xmx8g";
              graalvm = pkgs.graalvm-ce;
              extraNativeImageBuildArgs = [
                "--native-image-info"
                "--no-fallback"
                "-H:-CheckToolchain"
                #"--initialize-at-build-time"
                #"--initialize-at-run-time=io.github.treesitter.jtreesitter.internal.TreeSitter"
                #"--initialize-at-run-time=io.github.treesitter.jtreesitter.internal.TreeSitter$ts_parser_parse_string_encoding"
                #"--initialize-at-run-time=io.github.treesitter.jtreesitter.internal.TreeSitter$ts_parser_new"
                #"--initialize-at-run-time=io.github.treesitter.jtreesitter.internal.TreeSitter$ts_parser_set_language"
              ];
            };

            # derive the parser
            parser = pkgs.stdenv.mkDerivation {
              name = "parser";
              src = ./.;
              nativeBuildInputs = [
                pkgs.gcc
                pkgs.findutils
                pkgs.patchelf
              ];
              buildPhase = ''
                ${pkgs.gcc}/bin/gcc -o parser \
                  main.c \
                  -I${pkgs.tree-sitter}/include \
                  ${pkgs.tree-sitter-grammars.tree-sitter-markdown}/parser \
                  ${pkgs.tree-sitter-grammars.tree-sitter-python}/parser \
                  ${pkgs.tree-sitter}/lib/libtree-sitter.${dylibExt}
              '';

              installPhase = ''
                mkdir -p $out/bin;
                cp parser $out/bin/parser;
              '';

              fixupPhase = ''
                find $out -type f -exec patchelf --shrink-rpath '{}' \; -exec strip '{}' \; 2>/dev/null
              '';
            };

            # the script must have gh in the PATH
            default = pkgs.writeShellScriptBin "entrypoint" ''
              export PATH=${pkgs.lib.makeBinPath [parser]}
              parser "$@"
            '';

          };

          devShells.default = pkgs.devshell.mkShell {
            name = "java-tree-sitter-shell";
            packages = [
              pkgs.tree-sitter
              pkgs.gcc
              (pkgs.clojure.override { jdk = pkgs.openjdk22; })
              pkgs.go # Added Golang
            ];
            commands = [
              {
                name = "lock-clojure-deps";
                help = "update deps-lock.json whenever deps.edn changes";
                command = "nix run github:jlesquembre/clj-nix#deps-lock";
              }
            ];
          };
        }
      );
}

{
  description = "tree-sitter";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";

    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

  };

  outputs = { self, nixpkgs, flake-utils, ...}@inputs:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlays = [
            inputs.devshell.overlays.default
          ];
          pkgs = import nixpkgs {
            inherit overlays system;
          };

        in rec {
          packages = rec {

            # https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/go/module.nix
            goBinary = pkgs.buildGoModule {
              pname = "tree-sitter-query";
              version = "0.1.0";
              src = ./.; # Assuming your Go code is in the same directory as the flake.nix

              CGO_ENABLED = "1";

              # If you're not using vendored dependencies, compute the hash of your go.mod and go.sum
              # You can get this hash by first setting it to lib.fakeSha256,
              # then running the build and replacing it with the correct hash
              vendorHash = "sha256-/X9cuzpVzVOqcON3c2GtUwCXi6gfFzjjQ8r+D0Yhgu8=";

              postInstall = ''
                mv $out/bin/ts $out/bin/entrypoint
              '';
              
              # Specify the package to build if it's not in the root of your project
              subPackages = [ "cmd/ts" ];
            };

            default = goBinary;
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
            ];
          };
        }
      );
}

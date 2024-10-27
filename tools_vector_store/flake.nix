{
  description = "Langchain Based Tools Vector Store";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

    outputs = { self, nixpkgs, flake-utils, devshell }:

    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlays = [
            devshell.overlays.default
          ];
          pkgs = import nixpkgs {
            inherit system overlays;
          };

          sqlite-vec = pkgs.callPackage ./sqlite-vec.nix {};

        in
        rec {

          packages = rec {

            vecstore = pkgs.callPackage ./derivation.nix {inherit sqlite-vec;};

            # this derivation just contains the init.clj script
            scripts = pkgs.stdenv.mkDerivation {
              name = "scripts";
              src = ./.;
              installPhase = ''
                cp init.clj $out
              '';
            };

            run-entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
              export PATH=${pkgs.lib.makeBinPath [vecstore pkgs.man]}
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              /usr/local/bin/bb ${scripts} "$@"
            '';

            default = pkgs.buildEnv {
              name = "codescope";
              paths = [ run-entrypoint ];
            };
          };

          devShells.default = pkgs.mkShell {
            name = "python";
            nativeBuildInputs = with pkgs;
              let
                devpython = pkgs.python3.withPackages
                  (packages: with packages; [ virtualenv pip setuptools wheel pytest pylint sqlite ]);
              in
              [ devpython ];
          };
        });

}


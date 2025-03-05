{
  description = "{{tool}}";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ...}@inputs:

    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };

        in rec
        {
          packages = rec {

            # this derivation just contains the init.clj script
            scripts = pkgs.stdenv.mkDerivation {
              name = "scripts";
              src = ./.;
              installPhase = ''
                mkdir $out
                cp *.clj $out
                cp bb.edn $out
              '';
            };

            run-entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              cd ${scripts}
              /usr/local/bin/bb init.clj "$@"
            '';

            default = pkgs.buildEnv {
              name = "bb";
              paths = [ run-entrypoint ];
            };
          };
        });
}


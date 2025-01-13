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

            run-entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
               ${pkgs.sqlite}/bin/sqlite3 "$@"
            '';

            default = pkgs.buildEnv {
              name = "sqlite";
              paths = [ run-entrypoint ];
            };
          };
        });
}


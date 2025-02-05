{
  description = "javascript runner";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
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

        in
        rec {

          packages = rec {

            nodeDependencies = (pkgs.callPackage ./default.nix {}).nodeDependencies;

            # this derivation just contains the init.clj script
            scripts = pkgs.stdenv.mkDerivation {
              name = "scripts";
              src = ./.;
              installPhase = ''
                cp main.js $out
              '';
            };

            default = pkgs.writeShellScriptBin "entrypoint" ''
              ${pkgs.nodejs}/bin/node ${scripts} "$@"
            '';
          };
        });
}

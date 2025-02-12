{
  description = "docker_scout_tag_recommendation function";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    # can't update graal right now - this is from Aug '23
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, devshell, ...}@inputs:

    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlays = [
            devshell.overlays.default
          ];
          # don't treat pkgs as meaning nixpkgs - treat it as all packages!
          pkgs = import nixpkgs {
            inherit overlays system;
          };

        in rec
        {
          scripts = pkgs.stdenv.mkDerivation {
            name = "scripts";
            src = ./.;
            installPhase = ''
              mkdir -p $out/resources
              cp -R . $out
              cp init.clj $out
            '';
          };
          entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
            OLD_PWD="$PWD"
            cd ${scripts}
            ${pkgs.babashka}/bin/bb init.clj $OLD_PWD "$@"
          '';
          packages = rec {
            default = pkgs.buildEnv {
              name = "install";
              paths = [
                pkgs.coreutils
                entrypoint
              ];
            };
          };

          devShells.default = pkgs.devshell.mkShell {
            name = "devshell";
            packages = with pkgs; [ babashka clojure ];

            commands = [
            ];
          };
        });
}

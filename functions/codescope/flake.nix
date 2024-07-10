{
  description = "pre-commit in docker";

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
          clipboard = pkgs.callPackage ./clipboard.nix {};

        in
        rec {

          packages.clipboard = clipboard;
          packages.default = pkgs.callPackage ./derivation.nix {inherit clipboard;};
          devShells.default = pkgs.mkShell {
            name = "python";
            nativeBuildInputs = with pkgs;
              let
                devpython = pkgs.python3.withPackages
                  (packages: with packages; [ virtualenv pip setuptools wheel pytest pylint ]);
              in
              [ devpython ];
          };
        });
}

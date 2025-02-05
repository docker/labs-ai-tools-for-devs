{
  description = "what is my ip";

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

            default = pkgs.writeShellScriptBin "entrypoint" ''
              ${pkgs.curl}/bin/curl -s http://httpbin.org/get | \
                  ${pkgs.jq}/bin/jq --raw-output .origin
            '';
          };
        });
}

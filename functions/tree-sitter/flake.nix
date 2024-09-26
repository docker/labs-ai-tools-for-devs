{
  description = "tree-sitter";

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

            a = pkgs.tree-sitter.withPlugins (p: [ p.tree-sitter-python p.tree-sitter-markdown ]);

            # this derivation just contains the init.clj script
            scripts = pkgs.stdenv.mkDerivation {
              name = "scripts";
              src = ./.;
              installPhase = ''
                cp init.clj $out
              '';
            };

            # the script must have gh in the PATH
            default = pkgs.writeShellScriptBin "entrypoint" ''
              export PATH=${pkgs.lib.makeBinPath [pkgs.tree-sitter]}
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              ${pkgs.babashka}/bin/bb ${scripts} "$@"
            '';
          };

          devShells.default = pkgs.mkShell {
            packages = [ pkgs.tree-sitter pkgs.gcc ];
          };

        });
}

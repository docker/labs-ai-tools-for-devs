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

            # darwin versus linux
            dylibExt = if nixpkgs.lib.hasInfix "darwin" system then "dylib" else "so";  

            a = pkgs.tree-sitter.withPlugins (p: [ p.tree-sitter-python p.tree-sitter-markdown ]);

            markdown-grammar-source = pkgs.fetchFromGitHub {
              owner = "mdeiml";
              repo = "tree-sitter-markdown";
              rev = "28aa3baef73bd458d053b613b8bd10fd102b4405";
              sha256 = "sha256-HSjKYqjrJKPLbdq1UTvk/KnDqsIzVO7k5syCsIpAZpw=";
            };

            # build the grammar but does this work for macos?
            markdown-grammar = (pkgs.tree-sitter.buildGrammar {
              language = "markdown";
              version = "0.0.1";
              src = "${markdown-grammar-source}/tree-sitter-markdown";
            });
  
            # derive the parser
            parser = pkgs.stdenv.mkDerivation {
              name = "parser";
              src = ./.;
              nativeBuildInputs = [ pkgs.gcc
                                    pkgs.findutils
                                    pkgs.patchelf ];
              buildPhase = ''
                ${pkgs.gcc}/bin/gcc -o parser \
                  main.c \
                  -I${markdown-grammar-source}/tree-sitter-markdown/src \
	          -I${pkgs.tree-sitter}/include \
                  ${pkgs.tree-sitter}/lib/libtree-sitter.${dylibExt} \
                  ${markdown-grammar}/parser;
	      '';

	      installPhase = ''
	        mkdir -p $out/bin;
                mkdir -p $out/lib;
	        cp parser $out/bin/parser;
                cp ${markdown-grammar}/parser $out/lib/parser;
	      '';

              fixupPhase = ''
                find $out -type f -exec patchelf --shrink-rpath '{}' \; -exec strip '{}' \; 2>/dev/null
              '';
            };

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
              export PATH=${pkgs.lib.makeBinPath [parser]}
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              ${pkgs.babashka}/bin/bb ${scripts} "$@"
            '';
          };

          devShells.default = pkgs.mkShell {
            packages = [ pkgs.tree-sitter pkgs.gcc ];
          };

        });
}

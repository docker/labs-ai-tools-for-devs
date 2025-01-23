{
  description = "Go development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Go compiler and tools
            go
            gopls          # Go language server
            go-tools       # Additional Go tools
            delve         # Go debugger
            golangci-lint # Linter
          ];

          shellHook = ''
            echo "🚀 Welcome to Go development environment!"
            echo "Available tools:"
            echo "  - go (compiler)"
            echo "  - gopls (language server)"
            echo "  - golangci-lint (linter)"
            echo "  - delve (debugger)"
          '';
        };
      });
} 

{
  description = "write_file function";

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
            # Check if an argument was provided
            if [ $# -eq 0 ]; then
                echo "Error: No JSON argument provided"
                echo "Usage: $0 '{\"files\": [{\"path\": \"path\", \"executable\": false, \"content\": \"content\"}]}'"
                exit 1
            fi
            
            # Store the JSON input
            json_input="$1"
            
            # Validate JSON structure
            if ! echo "$json_input" | ${pkgs.jq}/bin/jq . &> /dev/null; then
                echo "Error: Invalid JSON format"
                exit 1
            fi
            
            # Check if the JSON has the expected structure
            if ! echo "$json_input" | ${pkgs.jq}/bin/jq -e '.files' &> /dev/null; then
                echo "Error: JSON does not contain 'files' array"
                exit 1
            fi
            
            # Get the number of files
            file_count=$(echo "$json_input" | ${pkgs.jq}/bin/jq '.files | length')
            
            # Initialize an array to store successfully written file paths
            declare -a written_files
            
            # Process each file in the array
            for ((i=0; i<$file_count; i++)); do
              # Extract file information
              path=$(echo "$json_input" | ${pkgs.jq}/bin/jq -r ".files[$i].path")
              executable=$(echo "$json_input" | ${pkgs.jq}/bin/jq -r ".files[$i].executable")
              content=$(echo "$json_input" | ${pkgs.jq}/bin/jq -r ".files[$i].content")
              
              # Write the content to the file
              echo "$content" > "$path"
              
              # Check if the write was successful
              if [ $? -eq 0 ]; then
                  # Add to the list of successfully written files
                  written_files+=("$path")
              else
                  echo "Error: Failed to write to $path"
              fi
            done
            
            printf "wrote files: \n"
            exit 0
            
            '';
            
    packages.default = entrypoint; 
  });
}

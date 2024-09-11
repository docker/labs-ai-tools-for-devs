---
tools:
  - name: run-tree-sitter-flow
    description: Runs a flow with fd and tree sitter in the current directory.
    parameters:
      type: object
      properties:
        fd_args:
          type: string
          description: The args to pass to fd
        output_dir:
          type: string
          description: The path to output files to
    container:
      image: vonwig/tree_sitter
      command:
        - "fdfind {{fd_args|safe}} | while read -r file; do mkdir -p \"{{output_dir|safe}}/$(dirname $file)\" && tree-sitter parse \"$file\" > \"{{output_dir|safe}}/$file.parsed\"; done"
  - name: delete_folder
    description: Runs rm -rf on a folder
    parameters:
      type: object
      properties:
        path:
          type: string
          description: Path of the folder to delete
    container:
      image: vonwig/bash_alpine
      command:
        - "rm -rf {{path|safe}}"
---

# prompt user

Delete `/thread/top-level/`

Run tree-sitter-flow
fd args are `-e py`
use `/thread/top-level` as output dir

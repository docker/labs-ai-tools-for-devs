---
tools:
  - name: run-tree-sitter
    description: Runs tree sitter in the current directory.
    parameters:
      type: object
      properties:
        tree_sitter_args:
          type: string
          description: The args to pass to tree-sitter-cli
    container:
      image: vonwig/tree_sitter
      command:
        - "tree-sitter {{tree_sitter_args|safe}}"
---

# prompt user

Use tree-sitter with args `parse '**/*.py' > /thread/ast.txt`


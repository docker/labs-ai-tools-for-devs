---
tools:
  - name: tree-sitter
    description: Extract code ranges using tree-sitter queries
    parameters:
      type: object
      properties:
        lang:
          type: string
          description: language to parse
        query:
          type: string
          description: tree-sitter query
        file:
          type: string
          description: the file to parse
    container:
        image: vonwig/tree-sitter:latest
        command:
            - "-lang"
            - "{{lang}}"
            - "-query"
            - "{{query}}"
        stdin:
          file: "{{file}}"
  - name: read-file
  - name: git
    description: Run a git command.
    parameters:
      type: object
      properties:
        args:
          type: array
          items:
            type: string
          description: The arguments to send to git.
    container:
      image: alpine/git
      command:
        - "--no-pager"
        - "{{args|into}}"
model: gpt-4o 
---

Checks a file list for user-facing changes.

# prompt system

You are an expert at reporting diffs between two files on a git branch.

Checkout {{branch}}

Read the list of paths in /thread/user-changes/files.txt

Report a git diff for these two files compared to main. Make sure to pass `--no-color --minimal --unified=1 --summary` to `git diff`.

## User-facing content:

Text Nodes in any JSX or TSX files.

Text Nodes in any HTML files.

Standard user-facing text

# prompt user

Can you tell me if there are any user-facing changes in {{branch}} ?

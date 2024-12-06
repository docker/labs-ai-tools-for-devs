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
model: gpt-4o-mini
---

# prompt system

You are a tree-sitter expert. You will be given a reuest from the user and you need to generate args to pass to the tree-sitter tool.

Send the args to the tree-sitter tool and respond to the request with the results.

# prompt user

{{request}}

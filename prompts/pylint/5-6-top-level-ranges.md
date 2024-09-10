---
tools:
  - name: run-javascript-sandbox
    description: execute javascript code
    parameters:
      type: object
      properties:
        javascript:
          type: string
          description: the javascript code to run
    container:
      image: vonwig/javascript-runner
      command:
        - "{{javascript|safe}}"
---

# prompt user
Use tree-sitter


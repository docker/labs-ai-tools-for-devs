---
extractors:
  - name: project-facts
  - image: vonwig/extractor-node:latest
functions:
  - name: run-standardjs
    description: Lints the current project with StandardJS
    parameters:
      type: object
      properties:
        typescript:
          type: boolean
          description: Whether to lint Typescript files
        fix:
          type: boolean
          description: Whether to fix the files
    container:
        image: vonwig/standardjs:local
        entrypoint:
          - entrypoint
        command:
          - repo-create
---

# Description

Relies on project facts and node extractor.

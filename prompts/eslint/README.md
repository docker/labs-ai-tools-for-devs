---
extractors:
  - name: project-facts
  - image: vonwig/extractor-node:latest
functions:
  - name: StandardJS
    description: Lint a project with StandardJS
    parameters:
      type: object
      description: If TS is needed, set --typescript is the first arg. for fixes, add --fix as the second arg.
    container:
        image: vonwig/standardjs:latest
---

# Description

Relies on project facts and node extractor.

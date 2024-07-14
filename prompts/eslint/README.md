---
extractors:
  - image: vonwig/extractor-eslint:latest
functions:
  - name: run-eslint
    description: Lints the current project with ESLint provided a config file already exists. If a config file does not exist, use StandardJS.
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The args to pass for ESLint. For example, '.'
        version: 
          type: number
          description: The ESLint version, 7-9 supported. Use 8 if unsure.
      required:
        - args
        - version
    container:
        image: vonwig/eslint-tool:latest
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
        files:
          type: array
          items:
              type: string
              description: The filepaths to pass to the linter. Defaults to .
      required:
        - typescript
        - fix
    container:
        image: vonwig/standardjs:latest
---

# Description

Relies on project facts and node extractor.

Local

```sh
docker build . -t vonwig/eslint:local
docker build . -t vonwig/extractor-eslint:local -f extractor.Dockerfile
docker build . -t vonwig/standardjs:local -f standardjs.Dockerfile
```

Push

```sh
docker build --push . -t vonwig/eslint:latest
docker build --push . -t vonwig/extractor-eslint:latest -f extractor.Dockerfile
docker build --push . -t vonwig/standardjs:latest -f standardjs.Dockerfile
```

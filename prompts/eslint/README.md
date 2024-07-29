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
        outputLevel:
          type: string
          description: Nullish values return a summary from the linter. `complaint` returns a list of editor complaints. `condensed` returns violations grouped by violation id. `json` returns the raw JSON output from the linter.
      required:
        - args
        - version
        - outputLevel
    container:
        image: vonwig/eslint:latest
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
        outputLevel:
          type: number
          description: Nullish values return a summary from the linter. `complaint` returns a list of editor complaints. `condensed` returns violations grouped by violation id. `json` returns the raw JSON output from the linter.
        files:
          type: array
          items:
              type: string
              description: The filepaths to pass to the linter. Defaults to .
      required:
        - typescript
        - fix
        - outputLevel
    container:
        image: vonwig/standardjs:latest
  - name: read_files
    description: Reads a set of files back
    parameters:
      type: object
      properties:
        files:
          type: array
          items:
            type: string
            description: Relative path to a file to read.
    container:
        image: vonwig/read_files:latest
  
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
docker build --push . -t vonwig/eslint:latest --push
docker build --push . -t vonwig/extractor-eslint:latest -f extractor.Dockerfile --push
docker build --push . -t vonwig/standardjs:latest -f standardjs.Dockerfile --push
```

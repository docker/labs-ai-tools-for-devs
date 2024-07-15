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
  - name: git-branch
    description: Handles git branches
    parameters:
      type: object
      properties:
        command:
          type: string
          description: The git command to use `checkout`, `merge`, or `branch`.
        args:
          type: string
          description: The args to use after the command
      required:
        - command
        - args
    container:
        image: vonwig/git:local
  - name: write_files
    description: Write a set of files to my project
    parameters:
      type: object
      properties:
        files:
          type: array
          items:
            type: object
            properties:
              path:
                type: string
                description: the relative path to the file that should be written
              content:
                type: string
                description: the content that should be written to a file
              executable:
                type: boolean
                description: whether to make the file executable
    container:
        image: vonwig/function_write_files:latest
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
  - name: complain
    description: Complain about a file
    parameters:
      type: object
      properties:
        start_location:
          type: array
          description: "Start location in edit, formatted [row, col]"
          items:
            type: number
            description: The row or column
        end_location:
          type: array
          description: "End location in edit, formatted [row, col]"
          items:
            type: number
            description: The row or column
        edit:
          type: string
          description: Code to insert between start_location and end_location which will resolve the violation. Do not include ignore comments.
      required:
        - start_location
        - end_location
    container:
        image: alpine:latest
        entrypoint:
          - echo
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

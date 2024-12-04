---
description: |
    Provide a detailed description, analysis, or annotation of a given Dockerfile,
    explaining its structure and functionality.

    Synonyms: explain my Dockerfile, annotate this Dockerfile...

    This tool can explain a pre-provided Dockerfile but it can also fetch the Dockerfile from the user's workspace.
tools:
  - name: cat_file
    description: fetch a file
    parameters:
      type: object
      properties:
        path:
          type: string
          description: Path of the folder to delete
    container:
      image: vonwig/bash_alpine
      command:
        - "cat {{path|safe}}"
  - name: findutils-by-name
    description: find files in a project by name
    parameters:
      type: object
      properties:
        glob:
          type: string
          description: the glob pattern for files that should be found
    container:
      image: vonwig/findutils:latest
      command:
        - find
        - .
        - -name
        - "{{glob|safe}}"
prompt-format: "django"
---

# prompt user

Start by fetching the ./Dockerfile in the project root.  If there is no Dockerfile, then search for other files named 'Dockerfile' in the project and ask which one we want to explain.

After fetching the Dockerfile contents, explain the Dockerfile line by line.

Requirements:
 + Each command MUST pre prefixed with its line number.
 + For each command, add links to the documentation if necessary.
 + Use a new paragraph for links to the documentation.
 + {% tip "How can I optimize my Dockerfile?" %}
 + {% tip "Can you rate my Dockerfile?" %}

Sample final output:

**01: FROM golang**

directly explain what it does, without prefix...

[See documentation](https://docs.docker.com/engine/reference/builder/#command)

**05: CMD something**

directly explain what it does, without prefix...

[See documentation](https://docs.docker.com/engine/reference/builder/#command)


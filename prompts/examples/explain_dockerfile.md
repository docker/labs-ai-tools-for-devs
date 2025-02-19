---
name: docker prompts
model: claude-3-5-sonnet-20241022
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
      volumes: 
        - "{{path|safe}}:/dockerfile:ro"
      command:
        - "cat /dockerfile"
prompt-format: "django"
arguments:
  - name: path
    description: path to the Dockerfile to explain
    required: true
---

# prompt explain dockerfile

## description

Provide a detailed description, analysis, or annotation of a given Dockerfile,
explaining its structure and functionality.

Synonyms: explain my Dockerfile, annotate this Dockerfile...

This tool can explain a pre-provided Dockerfile but it can also fetch the Dockerfile from the user's workspace.

## content

Start by fetching the Dockerfile located at the path {{path}} using the cat_file tool.

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


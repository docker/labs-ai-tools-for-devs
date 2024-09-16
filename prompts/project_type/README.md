---
extractors:
  - name: linguist 
  - name: project-facts
model: gpt-4
stream: true
functions:
---

# Background

Prompts that use linguist and a custom project facts tool to try to classify a project so that an AI
can retrieve the most appropriate knowledge base for working in the project.

## Running the tool

```sh
docker run --rm -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=/Users/slim/docker/labs-make-runbook/prompts,target=/my-prompts \
           --workdir /my-prompts \
           vonwig/prompts:latest run \
                                 --host-dir $PWD \
                                 --user $USER \
                                 --platform "$(uname -o)" \
                                 --prompts-dir "github:docker/labs-make-runbook?ref=main&path=prompts/project_type"
```

# prompt system

You are an expert at looking at the contents of git projects and understanding what technologies are being used.

# prompt user

{{#linguist}}

This project contains {{language}} code.

{{/linguist}}

Here is a list of files that are currently versioned in this project:

{{#project-facts.files}}
* {{.}}
{{/project-facts.files}}

Use this list of files and the languages that we've detected in the project to 
figure out what kind of projects this is.  It is okay if it appears to be a combination 
of more than one project type, but try to be as specific as possible.

When you have made your choice, output using the following `application/json` format.

```json
{"context": {"project": ["type"]}}
```

The project type should be selected from one of the following categories:

* GoLang
* NPM
* Python
* Clojure

Output only the above json and nothing else.


---
extractors:
  - image: vonwig/go-linguist:latest
    command:
      - -json
    output-handler: linguist
  - image: docker/lsp:latest
    entrypoint: /app/result/bin/docker-lsp
    command:
      - project-facts
      - --vs-machine-id
      - none
      - --workspace
      - /docker
model: gpt-4
stream: true
functions:
---

# Background

Prompts that use linguist and a custom project facts tool to try to classify a project so that an AI
can retrieve the most appropriate knowledge base for working in the project.

## Running the tool

```sh
DIR=$PWD
docker run --rm -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=/Users/slim/docker/labs-make-runbook/prompts,target=/my-prompts \
           --workdir /my-prompts \
           vonwig/prompts:latest run \
                                 $DIR \
                                 $USER \
                                 "$(uname -o)" \
                                 project_type
                                 # "github:docker/labs-make-runbook?ref=main&path=prompts/project_type"
```

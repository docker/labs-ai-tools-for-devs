---
extractors:
  - image: docker/lsp:latest
    entrypoint: /app/result/bin/docker-lsp
    command:
      - project-facts
      - --vs-machine-id
      - none
      - --workspace
      - /docker
---

## Description

The prompts for docker rely only on the classic lsp project extraction function.

The output of running this container is a json document that will be merged into the
context that is provided to the moustache template based prompts.


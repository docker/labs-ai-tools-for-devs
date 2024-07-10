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


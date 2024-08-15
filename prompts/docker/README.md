---
extractors:
  - name: project-facts
---

# Background

Generate a docker runbook for a project.

## How to run

```sh
# docker:command=curl
docker run --rm -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=$PWD,target=/app/local \
           --workdir /app \
           vonwig/prompts:latest run \
                                 --host-dir ~/docker/lsp \
                                 --user $USER \
                                 --platform "$(uname -o)" \
                                 --prompts-dir local
```


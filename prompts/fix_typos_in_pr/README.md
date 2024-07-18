---
extractors:
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: pr-create
  - name: git-commit
  - name: typo
  - name: findutils-by-name
---

# Background

Let's make a mistake

```sh
#docker:command=assistant
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PWD,target=/app/prompts \
           --workdir /app \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:local \
                                 run \
                                 $PWD \
                                 jimclark106 \
                                 "$(uname -o)" \
                                 prompts

```

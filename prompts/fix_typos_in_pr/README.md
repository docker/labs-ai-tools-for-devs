---
extractors:
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: pr-create
    description: create a new pull request
    parameters:
        type: object
        properties:
          title:
            type: string 
            description: the title of the pull request
          body:
            type: string 
            description: the body of the pull request
    container:
        env:
          GITHUB_TOKEN: ""
        image: vonwig/github-cli:latest
  - name: git-commit
    description: create a new pull request
    parameters:
        type: object
        properties:
          branch:
            type: string 
            description: the title of the pull request
    container:
        env:
          GITHUB_TOKEN: ""
        image: vonwig/git:latest
  - name: typo
    description: check a set of files for typos
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
                  description: the relative path to files that should be checked
    container:
        image: vonwig/typos:latest
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

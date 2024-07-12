---
model: gpt-4
stream: true
functions:
- name: git
    description: Run git file-related commands against a project
    parameters:
        type: object
        properties:
          command:
            type: string 
            description: The branch command. Either `rm`, `mv` or `add`. 
          args:
            type: array 
            description: The arguments to pass into the git command
            items: 
              type: string
              description: An argument to the git command
    container:
        image: alpine/git:latest
---

# Background

File management is a common use case of git, so this tool is used to execute commands to manage the staged files in a git repo (git rm, git add, git mv)

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
                                 git_files
                                 # "github:docker/labs-make-runbook?ref=main&path=prompts/git_files"
```

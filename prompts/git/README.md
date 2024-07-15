---
model: gpt-4
stream: true
extractors:
  - image: vonwig/git:local
    entrypoint: 
      - /extract.sh
functions:
  - name: git-branch
    description: Run git branch-related commands against a project
    parameters:
        type: object
        properties:
          command:
            type: string 
            description: The branch command. Either `branch`, `checkout` or `merge`. `rebase` can rewrite history and therefore should not be used.
          args:
            type: array 
            description: The arguments to pass into the git command
            items: 
              type: string
              description: An argument to the git command
    container:
        image: vonwig/git:local
---

# Background

Git project information

## Running the tool

```sh
DIR=$PWD
docker run --rm -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=/Users/colinmcneil/Dev/labs-ai-tools-for-devs/prompts,target=/my-prompts \
           --workdir /my-prompts \
           vonwig/prompts:latest run \
                                 $DIR \
                                 $USER \
                                 "$(uname -o)" \
                                 git_branches
```

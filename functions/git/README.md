---
extractors:
  - image: vonwig/git:latest
    entrypoint:
      - /extract.sh
functions:
  - name: git_branch
    description: Run git branch-related commands against a project
    parameters:
      type: object
      properties:
        command:
          type: string 
          description: The branch command. Either `branch`, `checkout` or `merge`. `rebase` can rewrite history and therefore should not be used.
        args:
          type: array
          items: 
            type: string
            description: An argument to the git command
    container:
      image: vonwig/git:latest
---

# Background

Git project information

## Running the tool

```sh
docker build . -t vonwig/git:local
```

---
functions:
  - name: eslint
    type: prompt
    ref: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/eslint
  - name: write_files
    description: Write a set of files to my project
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
                description: the relative path to the file that the script should run in
        script:
          type: string
          description: The script to run in the files.
    container:
      image: vonwig/apply_script:latest
  - name: read_eslint
    description: Loads ESLint violations
    parameters:
      type: object
      properties:
        output_level:
          type: string
          description: "`condensed` or `complaints`"
    container:
      image: vonwig/read_eslint
  - name: tree_sitter
    description: Gets the surrounding code block for a given line in a file
    parameters:
      type: object
      properties:
        path:
          type: string
          description: The filepath of the affected code
        line:
          type: number
          description: The affected line to load context from
    container:
      image: vonwig/tree_sitter
---

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PROMPTS_DIR,target=/app/eslint_fix \
           --workdir /app \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:latest \
                                 run \
                                 $PWD \
                                 $USER \
                                 "$(uname -o)" \
                                 eslint_fix
```
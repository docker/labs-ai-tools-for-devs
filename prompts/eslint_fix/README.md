---
functions:
  - name: run_lint
    type: prompt
    ref: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/eslint
  - name: parse_lint_results
    description: Loads lint violations grouped by type.
    parameters:
      type: object
      properties:
        outputLevel:
          type: string
          description: Supports `condensed` or `complaints`
    container:
      image: vonwig/read_eslint
  - name: violations_for_file
    description: Loads lint violations for a file.
    parameters:
      type: object
      properties:
        path:
          type: string
          description: Path to read violations for. Useful for getting line numbers. Always uses full `json` output level for most context. 
    container:
      image: vonwig/read_eslint
  - name: run_tree_sitter
    description: Gets context from source code for a given line.
    parameters:
      type: object
      properties:
        path:
          type: string
          description: The filepath of the affected code
        line:
          type: number
          description: The affected line to load context from
      required:
        - path
        - line
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
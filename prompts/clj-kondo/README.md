---
extractors:
  - name: go-linguist 
  - name: project-facts
model: gpt-4
stream: true
functions:
  - name: clj-kondo
    description: "lint clojure code"
    parameters:
      type: object
      properties:
        args:
          type: array
          description: "the arguments to pass to the linter"
          items:
            type: string
    container:
      image: vonwig/clj-kondo:latest
---

# Background

Ask about violations in a project that contains clojure code.

## Running the tool

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=/Users/slim/docker/labs-ai-tools-for-devs/prompts,target=/app/local \
           --workdir /app \
           vonwig/prompts:local run \
                                 /Users/slim/docker/labs-ai-tools-for-devs \
                                 jimclark106 \
                                 "$(uname -o)" \
                                 local/clj-kondo \
                                 --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)" \
                                 --thread-id "clj-kondo" \
                                 --save-thread-volume
```

## TODO

- [ ] the clj-kondo function is downloading into an `\?/.m2` repository in the project root.  We can't have this.

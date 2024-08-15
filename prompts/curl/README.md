---
extractors:
  - name: linguist 
  - name: docker-lsp
model: gpt-4
stream: true
functions:
  - name: curl
    description: "Run a curl command"
    parameters:
      type: object
      properties:
        args:
          type: string
          description: "The arguments to pass to curl"
    container:
      image: vonwig/curl:latest
---

# Background

* read tl/dr examples
* read man pages

After ragging the above content, do we know enough about curl to create and run curl examples.

Also, what about defining outcomes and having the tool verify that we actually ran this correctly and got the expected results?

At the end, we should report the command line, and the version of curl that we used.

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
                                 --host-dir $PWD \
                                 --user $USER \
                                 --platform "$(uname -o)" \
                                 --prompts-dir local
                                 # "github:docker/labs-make-runbook?ref=main&path=prompts/curl"
```

# Running prompts

## Running the docker prompts

### Directly

```sh
bb -m prompts /Users/slim/docker/labs-make-runbook jimclark106 darwin docker
```

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles
```

### Using Container

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PWD,target=/app/local \
           --workdir /app \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:local \
                                 run \
                                 /Users/slim/docker/labs-make-runbook \
                                 jimclark106 \
                                 "$(uname -o)" \
                                 local/prompts/dockerfiles
```

### Clean up local images

```sh
#docker:command=clean-local-images
bb -m clean-local-images
```


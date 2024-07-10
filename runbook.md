# Running prompts

## Running the docker prompts

### Directly

```sh
bb -m prompts /Users/slim/docker/labs-make-runbook jimclark106 darwin docker
```

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin dockerfiles

```

### Clean up local images

```sh
#docker:command=clean-local-images
bb -m clean-local-images
```


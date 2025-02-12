# Background

The `qrencode` function has one parameter.

* `args`: the args to send to the image

## Usage

This function should be given a rw bind mount for the root of a project.

```sh
docker run --rm \
       --mount type=bind,source=$PWD,target=/project \
       --entrypoint /app/result/bin/entrypoint \
       --workdir /project \
       vonwig/qrencode:latest '{"args": "-o /project/crap.png https://github.com/docker/labs-ai-tools-for-devs"}'
```

```sh
open crap.png
```

## Build

```sh
docker build -t vonwig/qrencode:latest .
```

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/qrencode:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/qrencode:latest
```

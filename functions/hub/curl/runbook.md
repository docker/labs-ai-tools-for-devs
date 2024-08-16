# Background

The `curl` function has one parameter.

* `args`: the args to send to the image

## Usage

This function should be given a rw bind mount for the root of a project.

```sh
docker run --rm \
       --mount type=bind,source=$PWD,target=/project \
       --entrypoint /app/result/bin/entrypoint \
       --workdir /project \
       vonwig/curl:latest '{"args": "--help"}'
```

## Build

```sh
docker build -t vonwig/curl:latest .
```

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/curl:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/curl:latest
```

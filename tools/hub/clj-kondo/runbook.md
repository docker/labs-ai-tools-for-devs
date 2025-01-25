# Background

The `curl` function has one parameter.

* `args`: the args to send to the image

## Usage

This function should be given a rw bind mount for the root of a project.

```sh
docker run --rm \
       --mount type=bind,source=/Users/slim/docker/labs-ai-tools-for-devs,target=/project \
       --workdir /project \
       vonwig/clj-kondo:latest '{"args": ["--lint","."]}' | jq .
```

## Build

```sh
docker build -t vonwig/clj-kondo:latest .
```

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/clj-kondo:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/clj-kondo:latest
```

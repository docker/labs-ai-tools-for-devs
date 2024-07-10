# Background

The `docker_scout_tag_recommendation` function has one parameters.

* `repository: the name of the repository for which we need a recommendation

## Usage

This function does not require project access so no bind mounts will be made.

```sh
docker run --rm vonwig/docker_scout_tag_recommendation:latest "$(echo '{"repository":"alpine"}')"
```

## Build

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/docker_scout_tag_recommendation:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/docker_scout_tag_recommendation:latest
```

# Background

The `write_file` function has wo parameters.

* `path`: is a relative path from some project_root
* `content`: is the content that should be written into the file

## Usage

This function should be given a rw bind mount for the root of a project.

```sh
docker run --rm --entrypoint /app/result/bin/entrypoint vonwig/what-is-my-ip:latest
```

## Build

```sh
docker build -t vonwig/what-is-my-ip:latest .
```

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/what-is-my-ip:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/what-is-my-ip:latest
```

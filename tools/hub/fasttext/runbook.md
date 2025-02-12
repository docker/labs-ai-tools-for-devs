# Background

The `write_file` function has wo parameters.

* `path`: is a relative path from some project_root
* `content`: is the content that should be written into the file

## Usage

This function should be given a rw bind mount for the root of a project.

```sh
docker run --rm \
       --mount type=bind,source=$PWD,target=/project \
       --entrypoint /app/result/bin/entrypoint \
       --workdir /project \
       vonwig/fasttext:latest '{}'
```

## Build

```sh
docker build -t vonwig/fasttext:latest .
```

```sh
# docker:command=build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/fasttext:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/fasttext:latest
```

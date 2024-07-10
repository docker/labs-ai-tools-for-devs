# Reproducible Build of Codescope

## Local Build

This will only work if you have a local nix install, which most of us do not.

To build the application locally, run the following command:

```sh
# docker:command=nix-build
nix build .
```

This will produce an executable in `/result/bin/codescope` that you can use to test locally.

## Docker Build

This works with only Docker installed on your machine and produces a verifiably _reproducible_ executable.  You will have to have access
to a CloudBuild instance to run this version.

```sh
# docker:command=release-build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/codescope:latest \
    --file Dockerfile \
    --push .
```

If you don't have access to a Cloudbuild instance, you can build the image locally with:

```
# docker:command=local-build
docker build -t vonwig/codescope:latest -f Dockerfile .
```

## Running

This is containerized so you'll need to bind mount the project path in the container.

```sh
docker run -it --rm --mount=type=bind,source=$PWD,target=/project vonwig/codescope:latest /project
```

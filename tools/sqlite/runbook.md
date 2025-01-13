
```sh
docker build -t vonwig/sqlite .
```

```sh
docker run -it --rm vonwig/sqlite
```

```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/sqlite:latest \
    --file Dockerfile \
    --push .
```

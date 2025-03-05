
```sh
docker build -t vonwig/sequential-thinking:latest .
```

```sh
docker run -it --rm \
           -v mcp-sequentialthinking:/sequentialthinking \
           vonwig/sequential-thinking:latest \
           '{"entities": [{"name": "me"}]}'
```

```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/sequentialthinking:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/sequentialthinking:latest
```



```sh
docker build -t vonwig/memory:latest .
```

```sh
docker run -it --rm \
           -v ~/slimslenderslacks/flask-nix-example:/project \
           -v mcp-memory:/memory \
           vonwig/memory:latest \
           'create-entities' \
           '{"entities": [{"name": "me"}]}'
```

```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/memory:latest \
    --file Dockerfile \
    --push .
```



```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag mcp/github-mcp-server:latest \
    --file Dockerfile \
    --push .
docker pull mcp/github-mcp-server:latest
```



```sh
docker build -t mcp/docker .
```

```sh
docker extension rm vonwig/labs-ai-tools-for-devs
```

```sh
docker extension install vonwig/labs-ai-tools-for-devs:0.1.16
```

```sh
docker extension update docker/labs-ai-tools-for-devs:0.1.4
```

```sh
# docker:command=build-pre-release
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag mcp/docker:prerelease \
    --file Dockerfile \
    --push .
docker pull mcp/docker:prerelease
```

```sh
# docker:command=build-release
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag mcp/docker:latest \
    --file Dockerfile \
    --push .
docker pull mcp/docker:latest
```

```sh
docker run --rm -t --init -v docker-prompts:/prompts alpine:latest tail -f /prompts/log/docker-mcp-server.out
```

```sh
clj -M:main serve --mcp --port 8811 --register "github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md"
```

```sh
docker run --rm -i --pull always -q --init \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           -p 8811:8811 \
           mcp/docker:latest \
           serve --mcp --port 8811 \
                 --register "github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md"
```

```sh
socat STDIO TCP:127.0.0.1:8811
```

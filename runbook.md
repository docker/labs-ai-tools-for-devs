```sh
docker build -t mcp/docker:0.0.1 .
```

```sh
cd src/extension && make build-extension
```

```sh
docker extension update docker/labs-ai-tools-for-devs:0.2.7
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
    --tag mcp/docker:0.0.1 \
    --file Dockerfile \
    --push .
docker pull mcp/docker:0.0.1
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

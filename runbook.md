
```sh
cd src/extension && make build-extension
```

```sh
docker extension update docker/labs-ai-tools-for-devs:0.2.8
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
VERSION="0.0.8"
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag mcp/docker:$VERSION \
    --file Dockerfile \
    --push .
docker pull mcp/docker:$VERSION
```

```sh
docker run --rm -t --init -v docker-prompts:/prompts alpine:latest tail -f /prompts/log/docker-mcp-server.out
```

```sh
clj -M:main-repl serve --mcp --port 8811
```

```sh
docker run --rm -i --pull always -q --init \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           -p 8811:8811 \
           mcp/docker:0.0.1 \
           serve --mcp --port 8811 \
           --register "github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md"
```

```sh
socat STDIO TCP:127.0.0.1:8811
```

```sh
docker x policy set my-policy '*'
docker x secret set 'stripe.api_key=....' --policy my-policy
```

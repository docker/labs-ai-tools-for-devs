
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
VERSION="0.0.18"
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
# logs to ./log/docker-mcp-server.out
# uses $HOME/.prompts-cache
# repl will be written to log

clj -M:main-repl serve --mcp --port 8811
```

```sh
docker run --rm -i --pull always -q --init \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v /run/host-services/backend.sock:/backend.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           -p 8811:8811 \
           -e "GATEWAY_CONTAINER_RM=false" \
           mcp/docker:0.0.15 \
           serve --mcp --port 8811
```

```sh
socat STDIO TCP:127.0.0.1:8811
```

```sh
docker x policy set my-policy '*'
docker x secret set 'stripe.api_key=....' --policy my-policy
```

```sh
docker container create --name docker-prompts -v docker-prompts:/prompts hello-world
docker cp ~/.prompts-cache/registry.yaml docker-prompts:/prompts
```

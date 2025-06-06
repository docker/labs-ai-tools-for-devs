extension:
	cd src/extension && \
	make build-extension && \
	docker extension install "docker/labs-ai-tools-for-devs:1.0.2"
mcp-plugin:
	cd ~/docker/cli-experiments && make mcp-plugin
build-gateway:
	docker buildx build \
          --builder hydrobuild \
          --platform linux/amd64,linux/arm64 \
          --tag mcp/docker:0.0.18 \
          --file Dockerfile \
          --push . && \
        docker pull mcp/docker:0.0.18
start-local:
	clj -M:main-repl --config $(cat ./registry.yaml)


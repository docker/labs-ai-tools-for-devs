```sh
docker build -t vonwig/inotifywait .
```

```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/inotifywait:latest \
    --file Dockerfile \
    --push .

```

```sh
docker run --rm -v "docker-prompts:/prompts" vonwig/inotifywait -e modify -e create -e delete -m -q /prompts/
```

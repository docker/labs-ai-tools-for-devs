```sh
docker build -t vonwig/inotifywait .
```

```sh
docker run --rm -v "docker-prompts:/prompts" vonwig/inotifywait -e modify -e create -e delete -m -q /prompts/
```

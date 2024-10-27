
```sh
docker build -t vonwig/tools-vector-store:local .
```

```sh
docker run -it --rm -e "OPENAI_API_KEY=$(cat ~/.openai-api-key)" vonwig/tools-vector-store:local "hola"
```

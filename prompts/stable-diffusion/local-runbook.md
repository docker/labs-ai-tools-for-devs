# Local

```sh
docker context use desktop-linux
```

```sh
docker buildx build --builder hydrobuild \
                    --platform linux/amd64,linux/arm64 \
                    --tag vonwig/evolute-stable-diffusion:latest \
                    --file Dockerfile \
                    --push .
```

```sh
docker run -d \
    --name evolute-stable-diffusion \
    -v $PWD:/app/output \
    -p 8000:8000 \
    vonwig/evolute-stable-diffusion:latest
```

```sh
docker kill evolute-stable-diffusion
```

```sh
docker rm evolute-stable-diffusion
```


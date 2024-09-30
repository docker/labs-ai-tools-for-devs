# Harmonia Engine Delete

```sh
docker --context evolute-stable-diffusion kill evolute-stable-diffusion
```

```sh
docker harmonia engine rm evolute-stable-diffusion
```

# Harmonia

```sh
docker harmonia engine create evolute-stable-diffusion --type aiml-amd64
```

```sh
docker context use evolute-stable-diffusion
```

```sh
docker context ls
```

```sh
docker harmonia engine ls
```

```sh
docker harmonia file-sync create --engine evolute-stable-diffusion $PWD
```

```sh
docker --context evolute-stable-diffusion run \
    -d --rm \
    --name evolute-stable-diffusion \
    --gpus all \
    -v $PWD:/app/output \
    -p 8000:8000 \
    vonwig/evolute-stable-diffusion:latest
```

```sh
docker --context evolute-stable-diffusion kill evolute-stable-diffusion
```

```sh
docker --context evolute-stable-diffusion ps
```

# Test directly from host

```sh
curl -X POST localhost:8000/generate \
     -H 'Content-Type: application/json' \
     -d '{"prompt": "a photo-realistic picture of a cyclist riding in Iceland. Use the style of Ray man.", "height": 512, "width": 512, "num_inference_steps": 50}'
```



```sh
docker build -t vonwig/bb:latest .
```

```sh
docker run -it --rm -v ~/slimslenderslacks/flask-nix-example:/project \
           --workdir /project vonwig/bb:latest \
           '{"path": "./src/app.py"}' \
           '(slurp (:path args))'
```

```sh
docker push vonwig/bb:latest
```

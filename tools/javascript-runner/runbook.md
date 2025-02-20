# prompt user

Write a javascript program that reads a javascript string from the first command line argument and then evaluates it.

# build

```sh
docker build -t vonwig/javascript-runner:latest .
```

```sh
docker push vonwig/javascript-runner:latest
```

# run

```sh
docker run --rm -v thread:/thread vonwig/javascript-runner:latest "console.log('gorsh');"
```

How do you use the javascript uuid function?

```sh
docker run --rm -v thread:/thread vonwig/javascript-runner:latest "const { v4 } = require('uuid'); console.log(v4());"
```

# multi-platform build

```sh
docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/javascript-runner:latest \
    --file Dockerfile \
    --push .
```

# using node2nix

```sh
nix shell -i nixpkgs#node2nix
```

```sh
node2nix 
```

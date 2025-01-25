## Build

```sh
#docker:command=gobuild
nix build .#goBinary --log-format bar-with-logs
```

```sh
docker build -t vonwig/tree-sitter .
```

```sh
# docker:command=release-build

docker buildx build \
    --builder hydrobuild \
    --platform linux/amd64,linux/arm64 \
    --tag vonwig/tree-sitter:latest \
    --file Dockerfile \
    --push .
docker pull vonwig/tree-sitter:latest
```

## Run

```sh
./result/bin/entrypoint -lang python -query "(module (function_definition) @top-level)" < test/resources/hello.py
./result/bin/entrypoint -lang markdown -query "(document (section (atx_heading (atx_h1_marker))) @h1)" < test/resources/hello.md
```

```sh
./result/bin/entrypoint -lang markdown < test/resources/hello.md
```

```sh
docker run --rm -i vonwig/tree-sitter -lang python -query "(module (function_definition) @top-level)" < <(echo "def hello():\n\tprint(\"hello\")")
```


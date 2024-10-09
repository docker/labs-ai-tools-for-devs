## Build

```sh
#docker:command=gobuild
nix build .#goBinary --log-format bar-with-logs
```

```sh
docker build -t vonwig/tree-sitter .
```

```sh
./result/bin/ts python "(module (function_definition) @top-level)" < test/resources/hello.py
./result/bin/ts markdown "(document (section (atx_heading (atx_h1_marker))) @h1)" < test/resources/hello.md
```

```sh
docker run --rm -i vonwig/tree-sitter python "(module (function_definition) @top-level)" < <(echo "def hello():\n\tprint(\"hello\")")
```


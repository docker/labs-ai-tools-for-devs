## Build

```sh
nix build .#parser
```

```sh
docker build -t vonwig/tree-sitter .
```

## Compile the java part

```sh
clojure -T:build compile-java
```

```sh
nix build .#clj --log-format bar-with-logs
```

```sh
nix build .#graal --log-format bar-with-logs
```

```sh
#docker:command=gobuild
nix build .#goBinary --log-format bar-with-logs
```

```sh
./result/bin/tree-sitter-clj-bin < test/resources/hello.py
```

```sh
./result/bin/ts "(module (function_definition) @top-level)" < <(echo "def hello():\n\tprint(\"hello\")")
```

```sh
#docker run --rm vonwig/tree-sitter "(module (function_definition) @top-level)" < <(echo "def hello():\n\tprint(\"hello\")")
docker run --rm vonwig/tree-sitter
```

## Run

The parser will read from stdin and write the sexp to the stdin.  I can't get this to work in OS/X right now 
(because of dylib issues) but it works on linux.

```sh
./result/bin/parser < <(echo "## hello\n")
```

Try markdown

```sh
docker run -i --rm vonwig/tree-sitter markdown < <(echo "## hello\n")
```

Try python

```sh
docker run -i --rm vonwig/tree-sitter python < <(echo "print(\"hello\")")
```


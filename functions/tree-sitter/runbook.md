## Build

```sh
nix build .#parser
```

## Run

The parser will read from stdin and write the sexp to the stdin.

```sh
./result/bin/parser < <(echo "## hello\n")
```


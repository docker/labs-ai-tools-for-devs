```sh
gcc -o parser main.c \
	-I/nix/store/156k0z5829d4hfikdaycvdxw5h3qw81l-tree-sitter-0.20.8/include \
    -L/nix/store/156k0z5829d4hfikdaycvdxw5h3qw81l-tree-sitter-0.20.8/lib \
	./tree-sitter-markdown/tree-sitter-markdown-inline/libtree-sitter-markdown-inline.a
```

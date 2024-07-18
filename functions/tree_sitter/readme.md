```sh
docker build . -t vonwig/tree_sitter
docker run --mount type=bind,source=$PWD,target=/project --workdir /project vonwig/tree_sitter '{"path": "test_file.py", "line": 32}'
```
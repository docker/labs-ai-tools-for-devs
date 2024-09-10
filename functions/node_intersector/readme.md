
```sh
docker build . -t vonwig/node_intersector
```

```sh
docker run --mount type=bind,source=$PWD,target=/project --workdir /project vonwig/node_intersector '{"path": "test_file.py", "line": 32}'
```


```sh
docker build . -t vonwig/read_files
docker run --mount type=bind,source=$PWD,target=/project --workdir /project vonwig/read_files '{"files":["Dockerfile"]}'
```
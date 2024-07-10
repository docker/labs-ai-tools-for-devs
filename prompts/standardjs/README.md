---
extractors:
  - image: vonwig/extractor-node:latest
---

# StandardJS Runbook

## Build the StandardJS image
```sh
#docker:command=build-local
docker build -t vonwig/standardjs:local .
```

```sh
#docker:command=build-push
docker build -t vonwig/standardjs --push .
```

## Run StandardJS in $PWD to lint JS
```sh
#docker:command=test-js
docker run -v $PWD:/project \
--workdir="/project" \
vonwig/standardjs:local
```

## Specify files
```sh
#docker:command=test-js
docker run -v $PWD:/project \
--workdir="/project" \
vonwig/standardjs:local bash /lint.sh my-file.js
```

## Autofix
```sh
#docker:command=test-fix
docker run -v $PWD:/project \
--workdir="/project" \
vonwig/standardjs:local \
bash /lint.sh --fix my-file.js
```

## Typescript Support
```sh
#docker:command=test-typescript
docker run -v $PWD:/project \
--workdir="/project" \
vonwig/standardjs:local \
bash /lint.sh --typescript --fix my-file.ts
```
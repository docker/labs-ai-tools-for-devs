# Running prompts

### help

```sh
clj -M:main --help
```

### run without --host-dir

```sh
clj -M:main prompts
```

### Plain prompt Generation

```sh
clj -M:main /Users/slim/docker/labs-ai-tools-for-devs jimclark106 darwin prompts/docker
```

```sh
clj -M:main /Users/slim/docker/labs-ai-tools-for-devs jimclark106 darwin prompts/docker --pretty-print-prompts
```

```sh
clj -M:main   --host-dir /Users/slim/docker/labs-ai-tools-for-devs \
              --platform darwin \
              --prompts-dir prompts/docker \
              --pretty-print-prompts
```

```sh
clj -M:main   --host-dir /Users/slim/docker/labs-ai-tools-for-devs \
              --platform darwin \
              --prompts-dir prompts/project_type/ \
              --pretty-print-prompts
```


### Running prompts/dockerfiles Conversation Loops

#### test prompts/project_type

Make sure the prompts/project_type prompts work on their own.

```sh
clj -M:main run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/project_type --debug
```

```sh
clj -M:main run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/project_type --nostream
```

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --platform darwin \
              --prompts-dir prompts/project_type \
              --nostream \
              --model "llama3.1" \
              --url http://localhost:11434/v1/chat/completions
```

TODO - this should fail better because the prompts-dir is not valid.

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --platform darwin \
              --prompts-dir prompts \
              --nostream \
              --model "llama3.1" \
              --url http://localhost:11434/v1/chat/completions
```


#### test prompts/dockerfiles (which uses prompts/project_type)

Now, verify that the prompts/dockerfiles prompts work with `gpt-4`.

```sh
clj -M:main run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles
```

Now, let's do the same thing using gpt-4 but without streaming.

```sh
clj -M:main run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles --nostream
```

Now, let's try with llama3.1.

```sh
# docker:command=llama
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles_llama3.1 \
              --url http://localhost:11434/v1/chat/completions \
              --model "llama3.1" \
              --nostream \
```

Now, let's try with mistral-nemo

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles_mistral-nemo \
              --url http://localhost:11434/v1/chat/completions \
              --model "mistral-nemo" \
              --nostream \
```

Mistral is kind of doing function calls but not openai compatible ones. It's listing a set of functions to call and not getting the arguments correct.

```sh
clj -M:main run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "mistral:latest" \
              --pretty-print-prompts
```

llama3-groq-tool-use:latest is writing functions but with a mix of xml and json markup.  It's not compatible with openai currently.
Also, the finish-reason is stop, instead of "tool_calls".  So the conversation loop ends too.

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "llama3-groq-tool-use:latest" 
```

#### Test single file prompts

```sh
rm ~/docker/labs-make-runbook/qrcode.png
```

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-file prompts/qrencode/README.md
```

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-file /Users/slim/docker/labs-ai-tools-for-devs/prompts/curl/README.md \
              --debug
```


```sh
open ~/docker/labs-make-runbook/qrcode.png
```

```sh
clj -M:main run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-file prompts/qrencode/README.md \
              --url http://localhost:11434/v1/chat/completions \
              --model "llama3.1" \
              --nostream \
              --debug
```

#### Using Containerized runner

```sh
docker run 
  --rm \
  --pull=always \
  -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --mount type=bind,source=$PWD,target=/app/local \
  --workdir /app \
  --mount type=volume,source=docker-prompts,target=/prompts \
  --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
  vonwig/prompts:local \
    run \
    --host-dir /Users/slim/docker/labs-make-runbook \
    --user jimclark106 \
    --platform "$(uname -o)" \
    --prompts-dir local/prompts/dockerfiles
```

### Clean up local images

```sh
#docker:command=clean-local-images
bb -m clean-local-images
```

## https://github.com/docker/labs-eslint-violations.git

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PWD,target=/app/local \
           --workdir /app \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:local \
                                 run \
                                 /Users/slim/repo/labs-eslint-violations \
                                 jimclark106 \
                                 "$(uname -o)" \
                                 local/prompts/eslint \
                                 --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)" \
                                 --thread-id "something"
```

# Test bad commands

1. remove the openai key
2. break the url with the --url flag
3. choose a bad prompts dir

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$PWD,target=/app/local \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --workdir /app \
           vonwig/prompts:local \
                                 run \
                                 --host-dir $PWD \
                                 --user $USER \
                                 --platform "$(uname -o)" \
                                 --prompts-dir local/prompts/poem \
```


```sh
docker build -t vonwig/prompts:local .
```

```sh
docker run --rm vonwig/prompts:local  --help
```

```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           --mount type=bind,source=$PWD,target=/app/workdir \
           --workdir /app/workdir \
           vonwig/prompts:local \
           run \
           --user jimclark106 \
           --host-dir /Users/slim/vonwig/altaservice \
           --platform $(uname -o) \
           --prompts-file /app/workdir/prompts/curl/README.md
```

```sh
./result/bin/agent-graph \
           run \
           --user jimclark106 \
           --host-dir /Users/slim/vonwig/altaservice \
           --platform $(uname -o) \
           --prompts-file /Users/slim/docker/labs-ai-tools-for-devs/prompts/curl/README.md

```

# Running prompts

### Plain prompt Generation

```sh
bb -m prompts /Users/slim/docker/labs-ai-tools-for-devs jimclark106 darwin prompts/docker
```

```sh
bb -m prompts /Users/slim/docker/labs-ai-tools-for-devs jimclark106 darwin prompts/docker --pretty-print-prompts
```

```sh
bb -m prompts --host-dir /Users/slim/docker/labs-ai-tools-for-devs \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/docker \
              --pretty-print-prompts
```

### Running prompts/dockerfiles Conversation Loops

Make sure the prompts/project_type prompts work on their own.

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/project_type --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)"
```

Now, verify that the prompts/dockerfiles prompts work with `gpt-4`.

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)"
```

Now, let's do the same thing using gpt-4 but without streaming.

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)" --nostream --debug
```

Now, let's try with llama3.1.

```sh
bb -m prompts run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "llama3.1" \
              --debug \
              --nostream
```

Mistral is kind of doing function calls but not openai compatible ones. It's listing a set of functions to call and not getting the arguments correct.

```sh
bb -m prompts run /Users/slim/docker/labs-make-runbook jimclark106 darwin prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "mistral:latest" \
              --pretty-print-prompts
```

llama3-groq-tool-use:latest is writing functions but with a mix of xml and json markup.  It's not compatible with openai currently.
Also, the finish-reason is stop, instead of "tool_calls".  So the conversation loop ends too.

```sh
bb -m prompts run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "llama3-groq-tool-use:latest" 
```


```sh
bb -m prompts run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/dockerfiles \
              --url http://localhost:11434/v1/chat/completions \
              --model "mistral-nemo" 
```

### Using Container

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
                                 /Users/slim/docker/labs-make-runbook \
                                 jimclark106 \
                                 "$(uname -o)" \
                                 local/prompts/dockerfiles \
                                 --pat "$(cat ~/.secrets/dockerhub-pat-ai-tools-for-devs.txt)"
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
                                 --thread-id "something" \
                                 --save-thread-volume
```

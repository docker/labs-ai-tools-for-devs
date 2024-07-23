# AI Tools for Developers

Agentic AI workflows enabled by Docker containers.

Source for many experiments in our [LinkedIn newsletter](https://www.linkedin.com/newsletters/docker-labs-genai-7204877599427194882/)

## Running Prompts

To generate prompts for a project, clone a repo into `$PWD` and run the 
following command.

```sh
docker run --rm \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           vonwig/prompts:latest $PWD \
                                 jimclark106 \
                                 darwin \
                                 "github:docker/labs-make-runbook?ref=main&path=prompts/lazy_docker"
```

The four arguments are 
* `project root dir on host`, 
* `docker login username`, 
* `platform`, 
* `github ref` for prompt files.

If you need to test prompts before you push, you can bind a local prompt directory instead of using
a GitHub ref.  For example, to test some local prompts in a directory named `my_prompts`, run:

```sh
docker run --rm \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PWD,target=/app/my_prompts \
           --workdir /app \
           vonwig/prompts:latest $PWD \
                                 jimclark106 \
                                 darwin \
                                 my_prompts
```

## Running a Conversation Loop

Set OpenAI key
```sh
echo $OPENAI_API_KEY > $HOME/.openai-api-key
```
Run
```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:latest \
                                 run \
                                 $PWD \
                                 $USER \
                                 "$(uname -o)" \
                                 "github:docker/labs-githooks?ref=main&path=prompts/git_hooks"
```

### Running a Conversation Loop with Local Prompts

If you want to run a conversation loop with local prompts then you need to think about two different directories, the one that the root of your project ($PWD above), 
and the one that contains your prompts (let's call that $PROMPTS_DIR).  Here's a command line for running the prompts when our $PWD is the project root and we've set the environment variable
$PROMPTS_DIR to point at the directory containing our prompts.

Set OpenAI key
```sh
echo $OPENAI_API_KEY > $HOME/.openai-api-key
```
Run
```sh
docker run --rm \
           -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --mount type=bind,source=$PROMPTS_DIR,target=/app/my_prompts \
           --workdir /app \
           --mount type=volume,source=docker-prompts,target=/prompts \
           --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
           vonwig/prompts:latest \
                                 run \
                                 $PWD \
                                 $USER \
                                 "$(uname -o)" \
                                 my_prompts
```

## GitHub refs

Prompts are fetched from a GitHub repository.  The mandatory parts of the ref are `github:{owner}/{repo}` 
but optional `path` and `ref` can be added to pull prompts from branches, and to specify a subdirectory
where the prompt files are located in the repo.

## Function volumes

Every function container will have a shared volume mounted into the container at `/thread`.
The volume is intended to be ephemeral and will be deleted at the end of the run.  However, the volume
can be saved for inspection by passing the argument `--save-thread-volume`.  The name of the shared volume
can also be controlled using `--thread-id <name>` but will normally just be a guid.

## Output json-rpc notifications

Add the flag `--jsonrpc` to the list of arguments to switch the stdout stream to be a series of `jsonrpc` notifications.  
This is useful if you are running the tool and streaming responses on to a canvas.

Try running the with the `--jsonrpc` to see a full example but the stdout stream will look something like this.

```
{"jsonrpc":"2.0","method":"message","params":{"content":" consistently"}}Content-Length: 65

{"jsonrpc":"2.0","method":"message","params":{"content":" high"}}Content-Length: 61

{"jsonrpc":"2.0","method":"message","params":{"content":"."}}Content-Length: 52

{"jsonrpc":"2.0","method":"functions","params":null}Content-Length: 57

{"jsonrpc":"2.0","method":"functions-done","params":null}Content-Length: 1703
```

### Prompt file layout

Each prompt directory should contain a README.md describing the prompts and their purpose.  Each prompt file
is a markdown document that supports moustache templates for subsituting context extracted from the project.

```
prompt_dir/
├── 010_system_prompt.md
├── 020_user_prompt.md
└── README.md
```

* ordering of messages is determined by filename sorting
* the role is encoded in the name of the file

### Moustache Templates

The prompt templates can contain expressions like {{dockerfiles}} to add information
extracted from the current project.  Examples of facts that can be added to the
prompts are:

* `{{platform}}` - the platform of the current development environment.
* `{{username}}` - the DockerHub username (and default namespace for image pushes)
* `{{languages}}` - names of languages discovered in the project.
* `{{project.dockerfiles}}` - the relative paths to local DockerFiles
* `{{project.composefiles}}` - the relative paths to local Docker Compose files.

The entire `project-facts` map is also available using dot-syntax
forms like `{{project-facts.project-root-uri}}`.  All moustache template
expressions documented [here](https://github.com/yogthos/Selmer) are supported.

## Building

```sh
#docker:command=build

docker build -t vonwig/prompts:local -f Dockerfile .
```


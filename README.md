# AI Tools for Developers

Agentic AI workflows enabled by Docker containers.

![overall architecture diagram preview](img1.png)

Source for many experiments in our [LinkedIn newsletter](https://www.linkedin.com/newsletters/docker-labs-genai-7204877599427194882/)

Docker Desktop Extension: https://hub.docker.com/extensions/docker/labs-ai-tools-for-devs

VSCode Extension: https://github.com/docker/labs-make-runbook

# What is this?

## Project-First Design
To get help from an assistant in your software development loop, the only context necessary is the project you are working on. 

### Extracting project context
![extractor architecture](img2.png)

An extractor is a Docker image that runs against a project and extracts information into a JSON context.

## Prompts as a trackable artifact
![prompts as a trackable artifact](img3.png)

Prompts are stored in a git repo and can be versioned, tracked, and shared. 

## Dockerized Tools
![dockerized tools](img4.png)

OpenAI API compatiable LLM's already support function calling. This is our workbench to test the same spec, but with functions as Docker images. Some of the benefits using Docker based on our [research](https://www.linkedin.com/newsletters/docker-labs-genai-7204877599427194882/) are enabling the LLM to: 
- take more complex actions
- deliver relevant context to the LLM without too many tokens
- work across a wider range of environments
- operate in a sandboxed environment

# Get Started

## Running a Conversation Loop

Set OpenAI key
```sh
echo $OPENAI_API_KEY > $HOME/.openai-api-key
```
Run
```sh
docker run 
  --rm \
  --pull=always \
  -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --mount type=volume,source=docker-prompts,target=/prompts \
  --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
  vonwig/prompts:latest \
    run \
    --host-dir $PWD \
    --user $USER \
    --platform "$(uname -o)" \
    --prompts "github:docker/labs-githooks?ref=main&path=prompts/git_hooks"
```

See [docs](https://vonwig.github.io/prompts.docs/#/page/running%20the%20prompt%20engine) for more details on how to run the conversation loop, 
and especially how to use it to run local prompts that are not yet in GitHub.

## Function volumes

Every function container will have a shared volume mounted into the container at `/thread`.
The volume is intended to be ephemeral and will be deleted at the end of the run.  However, the volume
can be saved for inspection by passing the argument `--thread-id`.  

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

### Notification Methods

#### message

This is a message from the assitant role, or from a tool role. 
The params for the `message` method should be appended to the conversation.  The `params` can be either 
`content` or `debug`.

```json
{"params": {"content": "append this output to the current message"}}
{"params": {"debug": "this is a debug message and should only be shown in debug mode"}}
```

#### prompts

Generated user and system prompts are sent to the client so that they can be displayed.  These
are sent after extractors are expanded so that users can see the actual prompts sent to the AI model.

```json
{"params": {"messages": [{"role": "system", "content": "system prompt message"}]}}
```

#### functions

Functions are json encoded strings.  When streaming, the content of the json params will change as 
the functions streams.  This can be rendered in place to show the function definition completing
as it streams.

```json
{"params": "{}"}
```

#### functions-done

This notification is sent when a function definition has stopped streaming, and is now being executed.  
The next notification after this will be a tool message.

```json
{"params": ""}
```

#### error

The `error` notification is not a message from the model, prompts, or tools.  Instead, it represents a kind
of _system_ error trying to run the conversation loop.  It should always be shown to the user as it 
probably represents something like a networking error or a configuration problem.

```json
{"params": {"content": "error message"}}
```

### Request Methods

#### prompt

Send a user prompt into the converstation loop.  The `prompt` method takes the following `params`.

```json
{"params": {"content": "here is the user prompt"}}
```

## Prompt file layout

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


---
title: Authoring Prompts
weight: 2
---

# Prompt files

A prompt is markdown content with a preamble describing tools available to the agent when executing this prompt.

We use `h1` headers to delineate sections that should be exposed as prompts. When authoring this markdown, you can include non-prompt sections 
using headers that don't start with the word "prompt". 

Here's a simple prompt that will use Docker official curl container to fetch gists from Github.


```markdown
---
tools:
  - name: curl
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

## Tools

Some tools, like curl, are available by default.  However, the container for a tool can also be defined inline.


```markdown
---
tools:
  - name: ffmpeg
    description: run the ffmpeg command
    parameters:
      type: object
      properties:
        args:
          description: arguments to pass to ffmpeg
          type: array
          items:
            type: string
    container:
      image: linuxserver/ffmpeg:version-7.1-cli
      command:
        - "{{args|into}}"
---

# prompt

Use ffmpeg to convert the file UsingPuppeteer.mp4 into an animated gif file at 1 frame per second.
The output file should be named UsingPuppeteer.gif.
```

The `name`, `description`, and `container` fields are mandatory, and you'll typically also have a `parameters` field to descript the json schema
of the parameters that the agent will extract from the conversation.

* `name` should uniquely identify the tool.
* `description` is important. Good descriptions help the agent understand the tool and how to use it.
* `container` sticks close to the format of a [compose service definition](https://docs.docker.com/reference/compose-file/services/) but does
  fully implement it. Many of the most common top-level arguments are supported (`image`, `command`, `volumes`)

You can interpolate into parameter properties into the container definition using strings with double curly braces. These substitutions also
support filters, such as `into`, which spreads an array parameter.  There are some common patterns for moving parameters into the container
runtime that we support for making it easier to use standard images.

## Models

If you don't specify a model in the preamble, the default model is currently set to be gpt-4 on openai. You can refer to other models and 
other endpoints using `model` and `url`.

```markdown
---
tools:
  - name: curl
model: claude-3-5-sonnet-20241022
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

If you specify an anthropic model, such as `model: claude-3-5-sonnet-20241022`, you do not need to specify the url. The correct anthropic
endpoint will be used.

{{< callout type="info" >}}
When using anthropic, do not change tool definitions to use `json_schema`. Use the openai standard of `parameters` - this will be automatically converted before making the api call.
{{< /callout >}}

### OpenAI-compatible endpoints (Ollama)

You can specify other openai-compatible endpoints by including a `url`.

```markdown
---
tools:
  - name: curl
url:  http://localhost/v1/chat/completions
stream: false
model: llama3.1
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

{{< callout type="info" >}}
Set streaming to false if you're using Ollama for tool calling. Ollama does not currently stream tool calls.
{{< /callout >}}

## Prompt Templates

It is common for prompts to contain parameters that are either extracted from a user interaction 
or, in the case of RAG, are populated by some sort of retrieval process. Markdown prompts can also
contain template parameters.

For example, the above curl example could be re-written as a template with a ``{{ user }}`` parameter.

```markdown
---yaml
tools:
  - name: curl
url:  http://localhost/v1/chat/completions
stream: false
model: llama3.1
arguments:
  - name: user
    description: the GitHub username to fetch gists for
    required: true
---

# prompt

Run the curl command, in silent mode, to fetch gists for user {{ user }} from GitHub.
```

### Template Engine

We support two templating engines today.

* [mustache](https://mustache.github.io/mustache.5.html) is the default
* [django](https://docs.djangoproject.com/en/5.1/topics/templates/)

If you want to use django, then add the following field in the markdown preamble.

```markdown
---
prompt-format: "django"
arguments:
  - name: user
    description: the GitHub username to fetch gists for
    required: true
---
```

### MCP arguments

MCP clients can use `arguments` to help you bind values into templates.

```yaml
---
prompt-format: "django"
---
```

### Binding values during testing

When running in VSCode, you can set values of the parameters in the markdown preamble. This is
a great way to quickly test your prompt during development.

```markdown
---
parameter-values:
  user: slimslenderslacks
---
```

### Extractors

Extractors are container functions that can be used to extract values when the prompt has been deployed
to a server. These extractors are also used to populate default values for a prompt when it is used from
an MCP client.

Extractor definitions also follow the pattern of compose services. They are just docker images but with 
the additional requirement that they should write `application/json` to stdout. This json will be used to
populate the context for binding parameters in the prompt template.

```markdown
---
extractors:
  - name: linguist
    image: vonwig/go-linguist:latest
    command:
      - -json
---
```

We can create lists if the extractor json output has array types.  For example,
if we run the linguist tool to extract language from a project, our prompt can list
them using the following template.  You need to be familar with the json format output
by linguist (eg that it creates lists of maps with a `language` key).

```markdown
---
extractors:
  - name: linguist 
---

# prompt

{{#linguist}}

This project contains {{language}} code.

{{/linguist}}

```


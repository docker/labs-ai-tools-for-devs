---
title: Authoring Prompts
weight: 2
---

# Prompt files

A prompt is markdown content with a preamble describing tools available to the agent when executing this prompt.

## Prompt Headers

We use `h1` headers to delineate sections that should be exposed as prompts. `h1` headers that start with `prompt` will be sent to the model.

We use `h2` headers to indicate metadata about the prompt. 

Both h1 and h2 headers are reserved keywords and should not be used in the markdown.

```markdown
# prompt I am a prompt header
## metadata I am metadata header
### header I am a regular header
```

You can also use h1 headers that don't start with the word "prompt" to organize your markdown.

```markdown
# I am not a prompt header
```

## Front-matter
Prompt files support a yaml front-matter section that can be used to specify tools, models, and other metadata.
Here's a simple prompt that will use Docker official curl container to fetch gists from Github.

## Example

```markdown
---
tools:
  - name: curl
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

## Adding Tools

Some tools, like curl, are available by default. However, you can add your own tools by adding a `tools` section to the front-matter.


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

The `name`, `description`, and `container` fields are mandatory, and you'll typically also have a `parameters` field to descript the json schema of the parameters that the agent will extract from the conversation.

* `name` should uniquely identify the tool.
* `description` is important. Good descriptions help the agent understand the tool and how to use it.
* `container` sticks close to the format of a [compose service definition](https://docs.docker.com/reference/compose-file/services/) but does
  fully implement it. Many of the most common top-level arguments are supported (`image`, `command`, `volumes`)

You can interpolate into parameter properties into the container definition using strings with double curly braces. These substitutions also support filters, such as `into`, which spreads an array parameter.  There are some common patterns for moving parameters into the container runtime that we support for making it easier to use standard images.

## Changing the Default Model

If you don't specify a model in the preamble, the default model is currently set to be `gpt-4` on OpenAI. You can refer to other models and their endpoints by specifying the `model` and `url` fields.

**We currentlysupport all models compatible with the OpenAI API or Anthropic API.**

```markdown
---
tools:
  - name: curl
model: llama3.2
url: http://localhost:11434/v1
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

### Pre-configured endpoints
If you specify a model that we know about, such as `model: claude-3-5-sonnet-20241022`, you do not need to specify the url. The correct anthropic endpoint will be used. Currently, we support pre-configured endpoints for Anthropic and OpenAI.

```markdown
---
tools:
  - name: curl
model: claude-3-5-sonnet-20241022
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

{{< callout type="info" >}}
When using Anthropic models, do not change tool definitions to use `json_schema`. Use the OpenAI standard of `parameters` - this will be automatically converted before making the api call.
{{< /callout >}}

### Streaming

The parameter `stream` can be used to control whether the tool call is streamed to the model. This is useful for models that do not support streaming. The default is `true`.

{{< callout type="info" >}}
Set streaming to false if you're using Ollama for tool calling. Ollama does not currently stream tool calls.
{{< /callout >}}

## Using Templates and Parameters in Prompts

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

### Testing Templates

When running in VSCode, you can set values of the parameters in the markdown preamble. This is
a great way to quickly test your prompt during development.

```markdown
---
parameter-values:
  user: slimslenderslacks
---
```

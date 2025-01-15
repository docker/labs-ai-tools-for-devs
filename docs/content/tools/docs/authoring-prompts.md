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


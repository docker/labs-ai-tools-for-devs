---
title: Quick Start w/ VSCode
weight: 1
---

{{% steps %}}

### Download `.vsix` extension

Download the `.vsix` extension from the [releases page](https://github.com/docker/labs-ai-tools-vscode/releases).

### Install extension from `.vsix` file

```sh
code --install-extension <path-to-vsix-file>
```

or use the VSCode command palette `Extensions: Install from VSIX...`

### Open a prompt
With the extension installed, open a prompt in VSCode. Examples can be found in the [examples](https://github.com/docker/labs-ai-tools-for-devs/tree/main/prompts/examples) directory.

### Configure OpenAI API Key, or use a different model.
Default model is `gpt-4` provided by OpenAI. Use an the VSCode command palette `Docker AI: Set secret key` to set your API key. 

**Changing the model:**
Use the following keys in the prompt front-matter to change the model:

Anthropic:
```yml
---
model: claude-3-5-sonnet-20240620
---
```


Ollama:
```yml
---
model: llama3.2
url: https://docker.host.internal:11434/v1
---
```

### Run the prompt
Use the VSCode command palette `Docker AI: Run this prompt` to run the prompt.

{{% /steps %}}

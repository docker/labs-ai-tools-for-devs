# translated-lara-mcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [translated](https://github.com/translated) |
| **Repository** | https://github.com/translated/lara-mcp |
| **Dockerfile** | https://github.com/translated/lara-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`translate`**: Translate text between languages with support for language detection and context-aware translations.

## Tools

### Tool: **`translate`**

Translate text between languages with support for language detection and context-aware translations.

| Parameter | Type | Description |
| - | - | - |
| `target` | `string` | The target language code (e.g., 'it-IT' for Italian). This specifies the language you want the text translated into. |
| `text` | `array` | An array of text blocks to translate. Each block contains a text string and a boolean indicating whether it should be translated. This allows for selective translation where some text blocks can be preserved in their original form while others are translated. |
| `context` | `string` *optional* | Additional context string to improve translation quality (e.g., 'This is a legal document' or 'Im talking with a doctor'). This helps the translation system better understand the domain. |
| `instructions` | `array` *optional* | A list of instructions to adjust the network’s behavior regarding the output (e.g., 'Use a formal tone'). |
| `source` | `string` *optional* | The source language code (e.g., 'en-EN' for English). If not specified, the system will attempt to detect it automatically. If you have a hint about the source language, you should specify it in the source_hint field. |
| `source_hint` | `string` *optional* | Used to guide language detection. Specify this when the source language is uncertain to improve detection accuracy. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "translated-lara-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "LARA_ACCESS_KEY_ID"
        "-e"
        "LARA_ACCESS_KEY_SECRET"
        "mcpcommunity/translated-lara-mcp"
      ],
      "env": {
        "LARA_ACCESS_KEY_ID": "YOUR_LARA_ACCESS_KEY_ID",
        "LARA_ACCESS_KEY_SECRET": "YOUR_LARA_ACCESS_KEY_SECRET"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/translated-lara-mcp -f Dockerfile https://github.com/translated/lara-mcp.git
```


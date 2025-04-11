# dmontgomery40-deepseek-mcp-server MCP Server

Model Context Protocol server for DeepSeek's advanced language models

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [DMontgomery40](https://github.com/DMontgomery40) |
| **Repository** | https://github.com/DMontgomery40/deepseek-mcp-server |
| **Dockerfile** | https://github.com/DMontgomery40/deepseek-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`chat_completion`**: 
 1. **`multi_turn_chat`**: 

## Tools

### Tool: **`chat_completion`**



| Parameter | Type | Description |
| - | - | - |
| `frequency_penalty` | `number` *optional* |  |
| `max_tokens` | `integer` *optional* |  |
| `message` | `string` *optional* |  |
| `messages` | `array` *optional* |  |
| `model` | `string` *optional* |  |
| `presence_penalty` | `number` *optional* |  |
| `temperature` | `number` *optional* |  |
| `top_p` | `number` *optional* |  |

### Tool: **`multi_turn_chat`**



| Parameter | Type | Description |
| - | - | - |
| `messages` | `string` |  |
| `frequency_penalty` | `number` *optional* |  |
| `max_tokens` | `integer` *optional* |  |
| `model` | `string` *optional* |  |
| `presence_penalty` | `number` *optional* |  |
| `temperature` | `number` *optional* |  |
| `top_p` | `number` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "dmontgomery40-deepseek-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "DEEPSEEK_API_KEY"
        "mcpcommunity/dmontgomery40-deepseek-mcp-server"
      ],
      "env": {
        "DEEPSEEK_API_KEY": "YOUR_DEEPSEEK_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/dmontgomery40-deepseek-mcp-server -f Dockerfile https://github.com/DMontgomery40/deepseek-mcp-server.git
```


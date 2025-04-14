# perplexity-ask MCP Server

Connector for Perplexity API, to enable real-time, web-wide research.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [ppl-ai](https://github.com/ppl-ai) |
| **Repository** | https://github.com/ppl-ai/modelcontextprotocol |
| **Dockerfile** | https://github.com/ppl-ai/modelcontextprotocol/blob/main/perplexity-ask/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`perplexity_ask`**: Engages in a conversation using the Sonar API. Accepts an array of messages (each with a role and content) and returns a ask completion response from the Perplexity model.
 1. **`perplexity_reason`**: Performs reasoning tasks using the Perplexity API. Accepts an array of messages (each with a role and content) and returns a well-reasoned response using the sonar-reasoning-pro model.
 1. **`perplexity_research`**: Performs deep research using the Perplexity API. Accepts an array of messages (each with a role and content) and returns a comprehensive research response with citations.

## Tools

### Tool: **`perplexity_ask`**

Engages in a conversation using the Sonar API. Accepts an array of messages (each with a role and content) and returns a ask completion response from the Perplexity model.

| Parameter | Type | Description |
| - | - | - |
| `messages` | `array` | Array of conversation messages |

### Tool: **`perplexity_reason`**

Performs reasoning tasks using the Perplexity API. Accepts an array of messages (each with a role and content) and returns a well-reasoned response using the sonar-reasoning-pro model.

| Parameter | Type | Description |
| - | - | - |
| `messages` | `array` | Array of conversation messages |

### Tool: **`perplexity_research`**

Performs deep research using the Perplexity API. Accepts an array of messages (each with a role and content) and returns a comprehensive research response with citations.

| Parameter | Type | Description |
| - | - | - |
| `messages` | `array` | Array of conversation messages |

## Use this MCP Server

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/perplexity-ask -f perplexity-ask/Dockerfile https://github.com/ppl-ai/modelcontextprotocol.git
```


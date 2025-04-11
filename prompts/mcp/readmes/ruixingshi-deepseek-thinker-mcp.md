# ruixingshi-deepseek-thinker-mcp MCP Server

A MCP provider Deepseek reasoning content to MCP-enabled AI Clients, like Claude Desktop. Supports access to Deepseek's CoT from the Deepseek API service or a local Ollama server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [ruixingshi](https://github.com/ruixingshi) |
| **Repository** | https://github.com/ruixingshi/deepseek-thinker-mcp |
| **Dockerfile** | https://github.com/ruixingshi/deepseek-thinker-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`get-deepseek-thinker`**: think with deepseek

## Tools

### Tool: **`get-deepseek-thinker`**

think with deepseek

| Parameter | Type | Description |
| - | - | - |
| `originPrompt` | `string` | user's original prompt |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ruixingshi-deepseek-thinker-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/ruixingshi-deepseek-thinker-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ruixingshi-deepseek-thinker-mcp -f Dockerfile https://github.com/ruixingshi/deepseek-thinker-mcp.git
```


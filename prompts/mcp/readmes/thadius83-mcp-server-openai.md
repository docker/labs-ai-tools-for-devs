# thadius83-mcp-server-openai MCP Server

mcp-server-openai with o3-mini support

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [thadius83](https://github.com/thadius83) |
| **Repository** | https://github.com/thadius83/mcp-server-openai |
| **Dockerfile** | https://github.com/thadius83/mcp-server-openai/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`ask-openai`**: Ask my assistant models a direct question

## Tools

### Tool: **`ask-openai`**

Ask my assistant models a direct question

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Ask assistant |
| `model` | `string` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "thadius83-mcp-server-openai": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/thadius83-mcp-server-openai"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/thadius83-mcp-server-openai -f Dockerfile https://github.com/thadius83/mcp-server-openai.git
```


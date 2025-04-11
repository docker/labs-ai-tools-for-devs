# ashdevfr-discourse-mcp-server MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [AshDevFr](https://github.com/AshDevFr) |
| **Repository** | https://github.com/AshDevFr/discourse-mcp-server |
| **Dockerfile** | https://github.com/AshDevFr/discourse-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`search_posts`**: Search Discourse posts

## Tools

### Tool: **`search_posts`**

Search Discourse posts

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Query |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ashdevfr-discourse-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "DISCOURSE_API_URL"
        "mcpcommunity/ashdevfr-discourse-mcp-server"
      ],
      "env": {
        "DISCOURSE_API_URL": "YOUR_DISCOURSE_API_URL"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ashdevfr-discourse-mcp-server -f Dockerfile https://github.com/AshDevFr/discourse-mcp-server.git
```


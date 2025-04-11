# hellokaton-unsplash-mcp-server MCP Server

🔎 A MCP server for Unsplash image search.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [hellokaton](https://github.com/hellokaton) |
| **Repository** | https://github.com/hellokaton/unsplash-mcp-server |
| **Dockerfile** | https://github.com/hellokaton/unsplash-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`search_photos`**: Search for Unsplash photos

## Tools

### Tool: **`search_photos`**

Search for Unsplash photos

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search keyword |
| `color` | `string` *optional* | Color filter (black_and_white, black, white, yellow, orange, red, purple, magenta, green, teal, blue) |
| `order_by` | `string` *optional* | Sort method (relevant or latest) |
| `orientation` | `string` *optional* | Orientation filter (landscape, portrait, squarish) |
| `page` | `integer` *optional* | Page number (1-based) |
| `per_page` | `integer` *optional* | Results per page (1-30) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "hellokaton-unsplash-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/hellokaton-unsplash-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/hellokaton-unsplash-mcp-server -f Dockerfile https://github.com/hellokaton/unsplash-mcp-server.git
```


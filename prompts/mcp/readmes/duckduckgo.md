# duckduckgo MCP Server

A Model Context Protocol (MCP) server that provides web search capabilities through DuckDuckGo, with additional features for content fetching and parsing.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [nickclyde](https://github.com/nickclyde) |
| **Repository** | https://github.com/nickclyde/duckduckgo-mcp-server |
| **Dockerfile** | https://github.com/nickclyde/duckduckgo-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`fetch_content`**: Fetch and parse content from a webpage URL.
 1. **`search`**: Search DuckDuckGo and return formatted results.

## Tools

### Tool: **`fetch_content`**

Fetch and parse content from a webpage URL.

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | The webpage URL to fetch content from |

### Tool: **`search`**

Search DuckDuckGo and return formatted results.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The search query string |
| `max_results` | `integer` *optional* | Maximum number of results to return (default: 10) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "duckduckgo": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/duckduckgo"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/duckduckgo -f Dockerfile https://github.com/nickclyde/duckduckgo-mcp-server.git
```


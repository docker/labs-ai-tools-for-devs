# ihor-sokoliuk-mcp-searxng MCP Server

MCP Server for SearXNG

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [ihor-sokoliuk](https://github.com/ihor-sokoliuk) |
| **Repository** | https://github.com/ihor-sokoliuk/mcp-searxng |
| **Dockerfile** | https://github.com/ihor-sokoliuk/mcp-searxng/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`searxng_web_search`**: Performs a web search using the SearxNG API, ideal for general queries, news, articles, and online content. Use this for broad information gathering, recent events, or when you need diverse web sources.
 1. **`web_url_read`**: Read the content from an URL. Use this for further information retrieving to understand the content of each URL.

## Tools

### Tool: **`searxng_web_search`**

Performs a web search using the SearxNG API, ideal for general queries, news, articles, and online content. Use this for broad information gathering, recent events, or when you need diverse web sources.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query |
| `count` | `number` *optional* | Number of results |
| `offset` | `number` *optional* | Pagination offset |

### Tool: **`web_url_read`**

Read the content from an URL. Use this for further information retrieving to understand the content of each URL.

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ihor-sokoliuk-mcp-searxng": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/ihor-sokoliuk-mcp-searxng"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ihor-sokoliuk-mcp-searxng -f Dockerfile https://github.com/ihor-sokoliuk/mcp-searxng.git
```


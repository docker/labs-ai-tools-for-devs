# brave-search MCP Server

Web and local search using Brave's Search API

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/brave-search/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`brave_local_search`**: Searches for local businesses and places using Brave's Local Search API. Best for queries related to physical locations, businesses, restaurants, services, etc. Returns detailed information including:
- Business names and addresses
- Ratings and review counts
- Phone numbers and opening hours
Use this when the query implies 'near me' or mentions specific locations. Automatically falls back to web search if no local results are found.
 1. **`brave_web_search`**: Performs a web search using the Brave Search API, ideal for general queries, news, articles, and online content. Use this for broad information gathering, recent events, or when you need diverse web sources. Supports pagination, content filtering, and freshness controls. Maximum 20 results per request, with offset for pagination.

## Tools

### Tool: **`brave_local_search`**

Searches for local businesses and places using Brave's Local Search API. Best for queries related to physical locations, businesses, restaurants, services, etc. Returns detailed information including:
- Business names and addresses
- Ratings and review counts
- Phone numbers and opening hours
Use this when the query implies 'near me' or mentions specific locations. Automatically falls back to web search if no local results are found.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Local search query (e.g. 'pizza near Central Park') |
| `count` | `number` *optional* | Number of results (1-20, default 5) |

### Tool: **`brave_web_search`**

Performs a web search using the Brave Search API, ideal for general queries, news, articles, and online content. Use this for broad information gathering, recent events, or when you need diverse web sources. Supports pagination, content filtering, and freshness controls. Maximum 20 results per request, with offset for pagination.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query (max 400 chars, 50 words) |
| `count` | `number` *optional* | Number of results (1-20, default 10) |
| `offset` | `number` *optional* | Pagination offset (max 9, default 0) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "BRAVE_API_KEY"
        "mcp/brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/brave-search -f src/brave-search/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


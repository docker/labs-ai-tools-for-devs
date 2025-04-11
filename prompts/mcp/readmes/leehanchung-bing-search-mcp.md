# leehanchung-bing-search-mcp MCP Server

MCP Server for Bing Search API

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [leehanchung](https://github.com/leehanchung) |
| **Repository** | https://github.com/leehanchung/bing-search-mcp |
| **Dockerfile** | https://github.com/leehanchung/bing-search-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`bing_image_search`**: Searches for images using Bing Image Search API for visual content.
 1. **`bing_news_search`**: Searches for news articles using Bing News Search API for current
    events and timely information.
 1. **`bing_web_search`**: Performs a web search using the Bing Search API for general information
    and websites.

## Tools

### Tool: **`bing_image_search`**

Searches for images using Bing Image Search API for visual content.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Image search query (required) |
| `count` | `integer` *optional* | Number of results (1-50, default 10) |
| `market` | `string` *optional* | Market code like en-US, en-GB, etc. |

### Tool: **`bing_news_search`**

Searches for news articles using Bing News Search API for current
    events and timely information.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | News search query (required) |
| `count` | `integer` *optional* | Number of results (1-50, default 10) |
| `freshness` | `string` *optional* | Time period of news (Day, Week, Month) |
| `market` | `string` *optional* | Market code like en-US, en-GB, etc. |

### Tool: **`bing_web_search`**

Performs a web search using the Bing Search API for general information
    and websites.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query (required) |
| `count` | `integer` *optional* | Number of results (1-50, default 10) |
| `market` | `string` *optional* | Market code like en-US, en-GB, etc. |
| `offset` | `integer` *optional* | Pagination offset (default 0) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "leehanchung-bing-search-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "BING_API_KEY"
        "mcpcommunity/leehanchung-bing-search-mcp"
      ],
      "env": {
        "BING_API_KEY": "YOUR_BING_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/leehanchung-bing-search-mcp -f Dockerfile https://github.com/leehanchung/bing-search-mcp.git
```


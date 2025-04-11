# amotivv-cloudflare-browser-rendering-mcp MCP Server

This MCP server provides tools for interacting with Cloudflare Browser Rendering, allowing you to fetch and process web content for use as context in LLMs directly from Cline or Claude Desktop.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [amotivv](https://github.com/amotivv) |
| **Repository** | https://github.com/amotivv/cloudflare-browser-rendering-mcp |
| **Dockerfile** | https://github.com/amotivv/cloudflare-browser-rendering-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`extract_structured_content`**: Extracts structured content from a web page using CSS selectors
 1. **`fetch_page`**: Fetches and processes a web page for LLM context
 1. **`search_documentation`**: Searches Cloudflare documentation and returns relevant content
 1. **`summarize_content`**: Summarizes web content for more concise LLM context
 1. **`take_screenshot`**: Takes a screenshot of a web page and returns it as an image

## Tools

### Tool: **`extract_structured_content`**

Extracts structured content from a web page using CSS selectors

| Parameter | Type | Description |
| - | - | - |
| `selectors` | `object` | CSS selectors to extract content |
| `url` | `string` | URL to extract content from |

### Tool: **`fetch_page`**

Fetches and processes a web page for LLM context

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to fetch |
| `maxContentLength` | `number` *optional* | Maximum content length to return |

### Tool: **`search_documentation`**

Searches Cloudflare documentation and returns relevant content

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query |
| `maxResults` | `number` *optional* | Maximum number of results to return |

### Tool: **`summarize_content`**

Summarizes web content for more concise LLM context

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to summarize |
| `maxLength` | `number` *optional* | Maximum length of the summary |

### Tool: **`take_screenshot`**

Takes a screenshot of a web page and returns it as an image

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to take a screenshot of |
| `fullPage` | `boolean` *optional* | Whether to take a screenshot of the full page or just the viewport (default: false) |
| `height` | `number` *optional* | Height of the viewport in pixels (default: 800) |
| `width` | `number` *optional* | Width of the viewport in pixels (default: 1280) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "amotivv-cloudflare-browser-rendering-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/amotivv-cloudflare-browser-rendering-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/amotivv-cloudflare-browser-rendering-mcp -f Dockerfile https://github.com/amotivv/cloudflare-browser-rendering-mcp.git
```


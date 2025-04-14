# scrapegraph MCP Server

ScapeGraph MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [ScrapeGraphAI](https://github.com/ScrapeGraphAI) |
| **Repository** | https://github.com/ScrapeGraphAI/scrapegraph-mcp |
| **Dockerfile** | https://github.com/ScrapeGraphAI/scrapegraph-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`markdownify`**: Convert a webpage into clean, formatted markdown.
 1. **`searchscraper`**: Perform AI-powered web searches with structured results.
 1. **`smartscraper`**: Extract structured data from a webpage using AI.

## Tools

### Tool: **`markdownify`**

Convert a webpage into clean, formatted markdown.

| Parameter | Type | Description |
| - | - | - |
| `website_url` | `string` | URL of the webpage to convert |

### Tool: **`searchscraper`**

Perform AI-powered web searches with structured results.

| Parameter | Type | Description |
| - | - | - |
| `user_prompt` | `string` | Search query or instructions |

### Tool: **`smartscraper`**

Extract structured data from a webpage using AI.

| Parameter | Type | Description |
| - | - | - |
| `user_prompt` | `string` | Instructions for what data to extract |
| `website_url` | `string` | URL of the webpage to scrape |

## Use this MCP Server

```json
{
  "mcpServers": {
    "scrapegraph": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SGAI_API_KEY",
        "mcp/scrapegraph"
      ],
      "env": {
        "SGAI_API_KEY": "YOUR_SGAI_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/scrapegraph -f Dockerfile https://github.com/ScrapeGraphAI/scrapegraph-mcp.git
```


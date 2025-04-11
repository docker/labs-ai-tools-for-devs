# oxylabs MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to seamlessly access web data through Oxylabs' powerful web scraping technology.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [oxylabs](https://github.com/oxylabs) |
| **Repository** | https://github.com/oxylabs/oxylabs-mcp |
| **Dockerfile** | https://github.com/oxylabs/oxylabs-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`oxylabs_scraper`**: Scrape url using Oxylabs Web API
 1. **`oxylabs_web_unblocker`**: Scrape url using Oxylabs Web Unblocker

## Tools

### Tool: **`oxylabs_scraper`**

Scrape url using Oxylabs Web API

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | Url to scrape with web scraper |
| `parse` | `string` *optional* | Should result be parsed. If result should not be parsed then html will be stripped and converted to markdown file |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |

### Tool: **`oxylabs_web_unblocker`**

Scrape url using Oxylabs Web Unblocker

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | Url to scrape with web unblocker |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/advanced-proxy-solutions/web-unblocker/headless-browser/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "oxylabs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "OXYLABS_USERNAME"
        "-e"
        "OXYLABS_PASSWORD"
        "mcp/oxylabs"
      ],
      "env": {
        "OXYLABS_USERNAME": "YOUR_USERNAME_HERE",
        "OXYLABS_PASSWORD": "YOUR_PASSWORD_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/oxylabs -f Dockerfile https://github.com/oxylabs/oxylabs-mcp.git
```


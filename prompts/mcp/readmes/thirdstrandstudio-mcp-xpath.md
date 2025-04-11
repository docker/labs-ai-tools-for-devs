# thirdstrandstudio-mcp-xpath MCP Server

MCP for evaluating xpath

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [thirdstrandstudio](https://github.com/thirdstrandstudio) |
| **Repository** | https://github.com/thirdstrandstudio/mcp-xpath |
| **Dockerfile** | https://github.com/thirdstrandstudio/mcp-xpath/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`xpath`**: Select query XML content using XPath
 1. **`xpathwithurl`**: Fetch content from a URL and select query it using XPath

## Tools

### Tool: **`xpath`**

Select query XML content using XPath

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The XPath query to execute |
| `xml` | `string` | The XML content to query |
| `mimeType` | `string` *optional* | The MIME type (e.g. text/xml, application/xml, text/html, application/xhtml+xml) |

### Tool: **`xpathwithurl`**

Fetch content from a URL and select query it using XPath

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The XPath query to execute |
| `url` | `string` | The URL to fetch XML/HTML content from |
| `mimeType` | `string` *optional* | The MIME type (e.g. text/xml, application/xml, text/html, application/xhtml+xml) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "thirdstrandstudio-mcp-xpath": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/thirdstrandstudio-mcp-xpath"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/thirdstrandstudio-mcp-xpath -f Dockerfile https://github.com/thirdstrandstudio/mcp-xpath.git
```


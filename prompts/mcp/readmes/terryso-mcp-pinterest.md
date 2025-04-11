# terryso-mcp-pinterest MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [terryso](https://github.com/terryso) |
| **Repository** | https://github.com/terryso/mcp-pinterest |
| **Dockerfile** | https://github.com/terryso/mcp-pinterest/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`pinterest_get_image_info`**: Get Pinterest image information
 1. **`pinterest_search`**: Search for images on Pinterest by keyword
 1. **`pinterest_search_and_download`**: Search for images on Pinterest by keyword and download them

## Tools

### Tool: **`pinterest_get_image_info`**

Get Pinterest image information

| Parameter | Type | Description |
| - | - | - |
| `image_url` | `string` | Image URL |

### Tool: **`pinterest_search`**

Search for images on Pinterest by keyword

| Parameter | Type | Description |
| - | - | - |
| `keyword` | `string` | Search keyword |
| `headless` | `boolean` *optional* | Whether to use headless browser mode (default: true) |
| `limit` | `integer` *optional* | Number of images to return (default: 10) |

### Tool: **`pinterest_search_and_download`**

Search for images on Pinterest by keyword and download them

| Parameter | Type | Description |
| - | - | - |
| `keyword` | `string` | Search keyword |
| `download_dir` | `string` *optional* | Directory to save downloaded images (default: /usr/src/app/downloads) |
| `headless` | `boolean` *optional* | Whether to use headless browser mode (default: true) |
| `limit` | `integer` *optional* | Number of images to return and download (default: 10) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "terryso-mcp-pinterest": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/terryso-mcp-pinterest"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/terryso-mcp-pinterest -f Dockerfile https://github.com/terryso/mcp-pinterest.git#master
```


# everaldo-mcp-mistral-ocr MCP Server

Model Context Protocol (MCP) Server for Mistral OCR API

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [everaldo](https://github.com/everaldo) |
| **Repository** | https://github.com/everaldo/mcp-mistral-ocr |
| **Dockerfile** | https://github.com/everaldo/mcp-mistral-ocr/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`list_tools`**: List available tools
 1. **`process_local_file`**: Process a local file from OCR_DIR
 1. **`process_url_file`**: Process a file from a URL

## Tools

### Tool: **`list_tools`**

List available tools

### Tool: **`process_local_file`**

Process a local file from OCR_DIR

| Parameter | Type | Description |
| - | - | - |
| `arguments` | `object` |  |

### Tool: **`process_url_file`**

Process a file from a URL

| Parameter | Type | Description |
| - | - | - |
| `arguments` | `object` |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "everaldo-mcp-mistral-ocr": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "MISTRAL_API_KEY"
        "mcpcommunity/everaldo-mcp-mistral-ocr"
      ],
      "env": {
        "MISTRAL_API_KEY": "YOUR_MISTRAL_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/everaldo-mcp-mistral-ocr -f Dockerfile https://github.com/everaldo/mcp-mistral-ocr.git#master
```


# handwriting-ocr MCP Server

Model Context Protocol (MCP) Server for Handwriting OCR 

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [Handwriting-OCR](https://github.com/Handwriting-OCR) |
| **Repository** | https://github.com/Handwriting-OCR/handwriting-ocr-mcp-server |
| **Dockerfile** | https://github.com/Handwriting-OCR/handwriting-ocr-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`check_status`**: Check the status of a document
 1. **`get_text`**: Retrieve the transcribed text from a document
 1. **`upload_document`**: Upload a document to Handwriting OCR API for transcription

## Tools

### Tool: **`check_status`**

Check the status of a document

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Document ID |

### Tool: **`get_text`**

Retrieve the transcribed text from a document

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Document ID |

### Tool: **`upload_document`**

Upload a document to Handwriting OCR API for transcription

| Parameter | Type | Description |
| - | - | - |
| `file` | `string` | Path to the document (PDF, JPG, PNG, etc.) |
| `delete_after` | `integer` *optional* | Seconds until auto-deletion (optional) |
| `extractor_id` | `string` *optional* | Extractor ID (required if action is extractor, will be ignored) |
| `prompt_id` | `string` *optional* | Prompt ID (requires Enterprise subscription, will be ignored) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "handwriting-ocr": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "API_TOKEN"
        "mcp/handwriting-ocr"
      ],
      "env": {
        "API_TOKEN": "your-api-token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/handwriting-ocr -f Dockerfile https://github.com/Handwriting-OCR/handwriting-ocr-mcp-server.git
```


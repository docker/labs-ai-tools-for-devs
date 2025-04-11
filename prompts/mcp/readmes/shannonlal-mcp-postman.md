# shannonlal-mcp-postman MCP Server

MCP Server for running Postman Collections with Newman

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [shannonlal](https://github.com/shannonlal) |
| **Repository** | https://github.com/shannonlal/mcp-postman |
| **Dockerfile** | https://github.com/shannonlal/mcp-postman/blob/refs/pull/38/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`run-collection`**: Run a Postman Collection using Newman

## Tools

### Tool: **`run-collection`**

Run a Postman Collection using Newman

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Path or URL to the Postman collection |
| `environment` | `string` *optional* | Optional path or URL to environment file |
| `globals` | `string` *optional* | Optional path or URL to globals file |
| `iterationCount` | `number` *optional* | Optional number of iterations to run |

## Use this MCP Server

```json
{
  "mcpServers": {
    "shannonlal-mcp-postman": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/shannonlal-mcp-postman"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/shannonlal-mcp-postman -f Dockerfile https://github.com/shannonlal/mcp-postman.git#refs/pull/38/merge
```


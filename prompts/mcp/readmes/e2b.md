# e2b MCP Server

Giving Claude ability to run code with E2B via MCP (Model Context Protocol)

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [e2b-dev](https://github.com/e2b-dev) |
| **Repository** | https://github.com/e2b-dev/mcp-server |
| **Dockerfile** | https://github.com/e2b-dev/mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`run_code`**: Run python code in a secure sandbox by E2B. Using the Jupyter Notebook syntax.

## Tools

### Tool: **`run_code`**

Run python code in a secure sandbox by E2B. Using the Jupyter Notebook syntax.

| Parameter | Type | Description |
| - | - | - |
| `code` | `string` |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "e2b": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "E2B_API_KEY"
        "mcp/e2b"
      ],
      "env": {
        "E2B_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/e2b -f Dockerfile https://github.com/e2b-dev/mcp-server.git
```


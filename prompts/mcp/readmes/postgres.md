# postgres MCP Server

Provides PostgreSQL database management capabilities. This server assists with analyzing existing PostgreSQL setups, providing implementation guidance, debugging database issues, managing schemas, migrating data, and monitoring database performance.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/postgres/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`query`**: Run a read-only SQL query

## Tools

### Tool: **`query`**

Run a read-only SQL query

| Parameter | Type | Description |
| - | - | - |
| `sql` | `string` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "postgres": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/postgres"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/postgres -f src/postgres/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


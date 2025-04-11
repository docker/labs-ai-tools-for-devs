# designcomputer-mysql_mcp_server MCP Server

A Model Context Protocol (MCP) server that enables secure interaction with MySQL databases

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [designcomputer](https://github.com/designcomputer) |
| **Repository** | https://github.com/designcomputer/mysql_mcp_server |
| **Dockerfile** | https://github.com/designcomputer/mysql_mcp_server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`execute_sql`**: Execute an SQL query on the MySQL server

## Tools

### Tool: **`execute_sql`**

Execute an SQL query on the MySQL server

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The SQL query to execute |

## Use this MCP Server

```json
{
  "mcpServers": {
    "designcomputer-mysql_mcp_server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/designcomputer-mysql_mcp_server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/designcomputer-mysql_mcp_server -f Dockerfile https://github.com/designcomputer/mysql_mcp_server.git
```


# f4ww4z-mcp-mysql-server MCP Server

A Model Context Protocol server for MySQL database operations

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [f4ww4z](https://github.com/f4ww4z) |
| **Repository** | https://github.com/f4ww4z/mcp-mysql-server |
| **Dockerfile** | https://github.com/f4ww4z/mcp-mysql-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`connect_db`**: Connect to MySQL database
 1. **`describe_table`**: Get table structure
 1. **`execute`**: Execute an INSERT, UPDATE, or DELETE query
 1. **`list_tables`**: List all tables in the database
 1. **`query`**: Execute a SELECT query

## Tools

### Tool: **`connect_db`**

Connect to MySQL database

| Parameter | Type | Description |
| - | - | - |
| `database` | `string` | Database name |
| `host` | `string` | Database host |
| `password` | `string` | Database password |
| `user` | `string` | Database user |
| `port` | `number` *optional* | Database port (optional) |

### Tool: **`describe_table`**

Get table structure

| Parameter | Type | Description |
| - | - | - |
| `table` | `string` | Table name |

### Tool: **`execute`**

Execute an INSERT, UPDATE, or DELETE query

| Parameter | Type | Description |
| - | - | - |
| `sql` | `string` | SQL query (INSERT, UPDATE, DELETE) |
| `params` | `array` *optional* | Query parameters (optional) |

### Tool: **`list_tables`**

List all tables in the database

### Tool: **`query`**

Execute a SELECT query

| Parameter | Type | Description |
| - | - | - |
| `sql` | `string` | SQL SELECT query |
| `params` | `array` *optional* | Query parameters (optional) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "f4ww4z-mcp-mysql-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/f4ww4z-mcp-mysql-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/f4ww4z-mcp-mysql-server -f Dockerfile https://github.com/f4ww4z/mcp-mysql-server.git
```


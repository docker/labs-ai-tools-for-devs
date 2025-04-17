# Postgres MCP Server

Provides PostgreSQL database management capabilities. This server assists with analyzing existing PostgreSQL setups, providing implementation guidance, debugging database issues, managing schemas, migrating data, and monitoring database performance.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/postgres/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/postgres)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`query`|Run a read-only SQL query|

---
## Tools Details

#### Tool: **`query`**
Run a read-only SQL query
Parameters|Type|Description
-|-|-
`sql`|`string` *optional*|

---
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
        "-e",
        "POSTGRES_URL",
        "mcp/postgres",
        "$POSTGRES_URL"
      ],
      "env": {
        "POSTGRES_URL": "postgresql://host.docker.internal:5432/mydb"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

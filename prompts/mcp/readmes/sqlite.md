# Sqlite MCP Server

Database interaction and business intelligence capabilities

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/sqlite/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`append_insight`|Add a business insight to the memo|
`create_table`|Create a new table in the SQLite database|
`describe_table`|Get the schema information for a specific table|
`list_tables`|List all tables in the SQLite database|
`read_query`|Execute a SELECT query on the SQLite database|
`write_query`|Execute an INSERT, UPDATE, or DELETE query on the SQLite database|

---
## Tools Details

#### Tool: **`append_insight`**
Add a business insight to the memo
Parameters|Type|Description
-|-|-
`insight`|`string`|Business insight discovered from data analysis

---
#### Tool: **`create_table`**
Create a new table in the SQLite database
Parameters|Type|Description
-|-|-
`query`|`string`|CREATE TABLE SQL statement

---
#### Tool: **`describe_table`**
Get the schema information for a specific table
Parameters|Type|Description
-|-|-
`table_name`|`string`|Name of the table to describe

---
#### Tool: **`list_tables`**
List all tables in the SQLite database
#### Tool: **`read_query`**
Execute a SELECT query on the SQLite database
Parameters|Type|Description
-|-|-
`query`|`string`|SELECT SQL query to execute

---
#### Tool: **`write_query`**
Execute an INSERT, UPDATE, or DELETE query on the SQLite database
Parameters|Type|Description
-|-|-
`query`|`string`|SQL query to execute

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/sqlite"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

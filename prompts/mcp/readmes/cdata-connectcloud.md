# CData Connect Cloud MCP Server

This full functional MCP Server allows you to connect to any data source in Connect Cloud from Claude Desktop. .

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/cdata-connectcloud](https://hub.docker.com/repository/docker/mcp/cdata-connectcloud)
**Author**|[CDataSoftware](https://github.com/CDataSoftware)
**Repository**|https://github.com/CDataSoftware/connectcloud-mcp-server
**Dockerfile**|https://github.com/CDataSoftware/connectcloud-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/cdata-connectcloud)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/cdata-connectcloud --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|

## Available Tools
Tools provided by this Server|Short Description
-|-
`execData`|Execute stored procedures against connected data sources|
`getCatalogs`|Retrieve a list of available connections from CData Connect Cloud.|
`getColumns`|Retrieve a list of available database columns from CData Connect Cloud for a specific catalog, schema, and table|
`getExportedKeys`|Retrieve a list of foreign key relationships from CData Connect Cloud for a specific catalog, schema, and table|
`getImportedKeys`|Retrieve a list of foreign key relationships from CData Connect Cloud for a specific catalog, schema, and table|
`getIndexes`|Retrieve a list of indexes from CData Connect Cloud for a specific catalog, schema, and table|
`getPrimaryKeys`|Retrieve a list of primary keys from CData Connect Cloud for a specific catalog, schema, and table|
`getProcedureParameters`|Retrieve a list of stored procedure parameters from CData Connect Cloud for a specific catalog, schema, and procedure|
`getProcedures`|Retrieve a list of stored procedures from CData Connect Cloud for a specific catalog and schema|
`getSchemas`|Retrieve a list of available database schemas from CData Connect Cloud for a specific catalog.|
`getTables`|Retrieve a list of available database tables from CData Connect Cloud for a specific catalog and schema.|
`queryData`|Execute SQL queries against connected data sources and retrieve results|

---
## Tools Details

#### Tool: **`execData`**
Execute stored procedures against connected data sources
Parameters|Type|Description
-|-|-
`procedure`|`string`|The name of the stored procedure to execute
`defaultSchema`|`string` *optional*|Schema to use if the procedure is not prefixed with a schema name
`parameters`|`object` *optional*|A JSON object containing procedure parameters. All parameter names must begin with @

---
#### Tool: **`getCatalogs`**
Retrieve a list of available connections from CData Connect Cloud.  The connection names should be used as catalog names in other tools and in any queries to CData Connect Cloud. Use the `getSchemas` tool to get a list of available schemas for a specific catalog.
#### Tool: **`getColumns`**
Retrieve a list of available database columns from CData Connect Cloud for a specific catalog, schema, and table
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter columns by
`columnName`|`string` *optional*|Optional column name to filter by
`schemaName`|`string` *optional*|Optional schema name to filter columns by
`tableName`|`string` *optional*|Optional table name to filter columns by

---
#### Tool: **`getExportedKeys`**
Retrieve a list of foreign key relationships from CData Connect Cloud for a specific catalog, schema, and table
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter keys by
`schemaName`|`string` *optional*|Optional schema name to filter keys by
`tableName`|`string` *optional*|Optional table name to filter by

---
#### Tool: **`getImportedKeys`**
Retrieve a list of foreign key relationships from CData Connect Cloud for a specific catalog, schema, and table
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter keys by
`schemaName`|`string` *optional*|Optional schema name to filter keys by
`tableName`|`string` *optional*|Optional table name to filter by

---
#### Tool: **`getIndexes`**
Retrieve a list of indexes from CData Connect Cloud for a specific catalog, schema, and table
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter indexes by
`schemaName`|`string` *optional*|Optional schema name to filter indexes by
`tableName`|`string` *optional*|Optional table name to filter by

---
#### Tool: **`getPrimaryKeys`**
Retrieve a list of primary keys from CData Connect Cloud for a specific catalog, schema, and table
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter keys by
`schemaName`|`string` *optional*|Optional schema name to filter keys by
`tableName`|`string` *optional*|Optional table name to filter by

---
#### Tool: **`getProcedureParameters`**
Retrieve a list of stored procedure parameters from CData Connect Cloud for a specific catalog, schema, and procedure
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter parameters by
`parameterName`|`string` *optional*|Optional parameter name to filter by
`procedureName`|`string` *optional*|Optional procedure name to filter parameters by
`schemaName`|`string` *optional*|Optional schema name to filter parameters by

---
#### Tool: **`getProcedures`**
Retrieve a list of stored procedures from CData Connect Cloud for a specific catalog and schema
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter procedures by
`procedureName`|`string` *optional*|Optional procedure name to filter by
`schemaName`|`string` *optional*|Optional schema name to filter procedures by

---
#### Tool: **`getSchemas`**
Retrieve a list of available database schemas from CData Connect Cloud for a specific catalog.  Use the `getTables` tool to get a list of available tables for a specific catalog and schema.
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter schemas by

---
#### Tool: **`getTables`**
Retrieve a list of available database tables from CData Connect Cloud for a specific catalog and schema.  Use the `getColumns` tool to get a list of available columns for a specific table.
Parameters|Type|Description
-|-|-
`catalogName`|`string` *optional*|Optional catalog name to filter tables by
`schemaName`|`string` *optional*|Optional schema name to filter tables by
`tableName`|`string` *optional*|Optional table name to filter by

---
#### Tool: **`queryData`**
Execute SQL queries against connected data sources and retrieve results
Parameters|Type|Description
-|-|-
`query`|`string`|The SQL statement(s) to execute. Separate multiple statements with semi-colons
`defaultSchema`|`string` *optional*|Schema to use if tables are not prefixed with a schema name
`parameters`|`object` *optional*|A JSON object containing a list of query parameters. All parameter names must begin with @
`schemaOnly`|`boolean` *optional*|If true, the result only includes column metadata

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "cdata-connectcloud": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CDATA_USERNAME",
        "-e",
        "CDATA_PAT",
        "mcp/cdata-connectcloud"
      ],
      "env": {
        "CDATA_USERNAME": "<your-cdata-username>",
        "CDATA_PAT": "<your-cdata-pat>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

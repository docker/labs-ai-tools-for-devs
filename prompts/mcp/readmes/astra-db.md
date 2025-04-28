# Astra DB MCP Server

An MCP server for Astra DB workloads.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/astra-db](https://hub.docker.com/repository/docker/mcp/astra-db)
**Author**|[datastax](https://github.com/datastax)
**Repository**|https://github.com/datastax/astra-db-mcp
**Dockerfile**|https://github.com/datastax/astra-db-mcp/blob/refs/pull/14/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/astra-db)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`BulkCreateRecords`|Create multiple records in a collection at once|
`BulkDeleteRecords`|Delete multiple records from a collection at once|
`BulkUpdateRecords`|Update multiple records in a collection at once|
`CreateCollection`|Create a new collection in the database|
`CreateRecord`|Create a new record in a collection|
`DeleteCollection`|Delete a collection from the database|
`DeleteRecord`|Delete a record from a collection|
`EstimateDocumentCount`|Estimate the number of documents in a collection using a fast, approximate count method|
`FindRecord`|Find records in a collection by field value|
`GetCollections`|Get all collections in the Astra DB database|
`GetRecord`|Get a specific record from a collection by ID|
`HelpAddToClient`|Help the user add the Astra DB client to their MCP client|
`ListRecords`|List records from a collection in the database|
`OpenBrowser`|Open a web browser to a specific URL|
`UpdateCollection`|Update an existing collection in the database|
`UpdateRecord`|Update an existing record in a collection|

---
## Tools Details

#### Tool: **`BulkCreateRecords`**
Create multiple records in a collection at once
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to create the records in
`records`|`array`|Array of records to insert

---
#### Tool: **`BulkDeleteRecords`**
Delete multiple records from a collection at once
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection containing the records
`recordIds`|`array`|Array of record IDs to delete

---
#### Tool: **`BulkUpdateRecords`**
Update multiple records in a collection at once
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection containing the records
`records`|`array`|Array of records to update with their IDs

---
#### Tool: **`CreateCollection`**
Create a new collection in the database
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to create
`dimension`|`number` *optional*|The dimensions of the vector collection, if vector is true
`vector`|`boolean` *optional*|Whether to create a vector collection

---
#### Tool: **`CreateRecord`**
Create a new record in a collection
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to create the record in
`record`|`object`|The record data to insert

---
#### Tool: **`DeleteCollection`**
Delete a collection from the database
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to delete

---
#### Tool: **`DeleteRecord`**
Delete a record from a collection
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection containing the record
`recordId`|`string`|ID of the record to delete

---
#### Tool: **`EstimateDocumentCount`**
Estimate the number of documents in a collection using a fast, approximate count method
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to estimate document count for

---
#### Tool: **`FindRecord`**
Find records in a collection by field value
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to search in
`field`|`string`|Field name to search by (e.g., 'title', '_id', or any property)
`value`|`string`|Value to search for in the specified field
`limit`|`number` *optional*|Maximum number of records to return

---
#### Tool: **`GetCollections`**
Get all collections in the Astra DB database
#### Tool: **`GetRecord`**
Get a specific record from a collection by ID
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to get the record from
`recordId`|`string`|ID of the record to retrieve

---
#### Tool: **`HelpAddToClient`**
Help the user add the Astra DB client to their MCP client
#### Tool: **`ListRecords`**
List records from a collection in the database
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to list records from
`limit`|`number` *optional*|Maximum number of records to return

---
#### Tool: **`OpenBrowser`**
Open a web browser to a specific URL
Parameters|Type|Description
-|-|-
`url`|`string`|The URL to open in the browser

---
#### Tool: **`UpdateCollection`**
Update an existing collection in the database
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection to update
`newName`|`string`|New name for the collection

---
#### Tool: **`UpdateRecord`**
Update an existing record in a collection
Parameters|Type|Description
-|-|-
`collectionName`|`string`|Name of the collection containing the record
`record`|`object`|The updated record data
`recordId`|`string`|ID of the record to update

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "astra-db": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ASTRA_DB_API_ENDPOINT",
        "-e",
        "ASTRA_DB_APPLICATION_TOKEN",
        "mcp/astra-db"
      ],
      "env": {
        "ASTRA_DB_API_ENDPOINT": "",
        "ASTRA_DB_APPLICATION_TOKEN": "your_astra_db_token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

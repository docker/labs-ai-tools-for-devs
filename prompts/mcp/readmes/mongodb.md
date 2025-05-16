# MongoDB MCP Server

A Model Context Protocol server to connect to MongoDB databases and MongoDB Atlas Clusters.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/mongodb](https://hub.docker.com/repository/docker/mcp/mongodb)
**Author**|[mongodb-js](https://github.com/mongodb-js)
**Repository**|https://github.com/mongodb-js/mongodb-mcp-server
**Dockerfile**|https://github.com/mongodb-js/mongodb-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/mongodb)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/mongodb --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`aggregate`|Run an aggregation against a MongoDB collection|
`collection-indexes`|Describe the indexes for a collection|
`collection-schema`|Describe the schema for a collection|
`collection-storage-size`|Gets the size of the collection|
`count`|Gets the number of documents in a MongoDB collection|
`create-collection`|Creates a new collection in a database.|
`create-index`|Create an index for a collection|
`db-stats`|Returns statistics that reflect the use state of a single database|
`delete-many`|Removes all documents that match the filter from a MongoDB collection|
`drop-collection`|Removes a collection or view from the database.|
`drop-database`|Removes the specified database, deleting the associated data files|
`explain`|Returns statistics describing the execution of the winning plan chosen by the query optimizer for the evaluated method|
`find`|Run a find query against a MongoDB collection|
`insert-many`|Insert an array of documents into a MongoDB collection|
`list-collections`|List all collections for a given database|
`list-databases`|List all databases for a MongoDB connection|
`mongodb-logs`|Returns the most recent logged mongod events|
`rename-collection`|Renames a collection in a MongoDB database|
`switch-connection`|Switch to a different MongoDB connection.|
`update-many`|Updates all documents that match the specified filter for a collection|

---
## Tools Details

#### Tool: **`aggregate`**
Run an aggregation against a MongoDB collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`pipeline`|`array`|An array of aggregation stages to execute

---
#### Tool: **`collection-indexes`**
Describe the indexes for a collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name

---
#### Tool: **`collection-schema`**
Describe the schema for a collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name

---
#### Tool: **`collection-storage-size`**
Gets the size of the collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name

---
#### Tool: **`count`**
Gets the number of documents in a MongoDB collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`query`|`object` *optional*|The query filter to count documents. Matches the syntax of the filter argument of db.collection.count()

---
#### Tool: **`create-collection`**
Creates a new collection in a database. If the database doesn't exist, it will be created automatically.
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name

---
#### Tool: **`create-index`**
Create an index for a collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`keys`|`object`|The index definition
`name`|`string` *optional*|The name of the index

---
#### Tool: **`db-stats`**
Returns statistics that reflect the use state of a single database
Parameters|Type|Description
-|-|-
`database`|`string`|Database name

---
#### Tool: **`delete-many`**
Removes all documents that match the filter from a MongoDB collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`filter`|`object` *optional*|The query filter, specifying the deletion criteria. Matches the syntax of the filter argument of db.collection.deleteMany()

---
#### Tool: **`drop-collection`**
Removes a collection or view from the database. The method also removes any indexes associated with the dropped collection.
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name

---
#### Tool: **`drop-database`**
Removes the specified database, deleting the associated data files
Parameters|Type|Description
-|-|-
`database`|`string`|Database name

---
#### Tool: **`explain`**
Returns statistics describing the execution of the winning plan chosen by the query optimizer for the evaluated method
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`method`|`array`|The method and its arguments to run

---
#### Tool: **`find`**
Run a find query against a MongoDB collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`filter`|`object` *optional*|The query filter, matching the syntax of the query argument of db.collection.find()
`limit`|`number` *optional*|The maximum number of documents to return
`projection`|`object` *optional*|The projection, matching the syntax of the projection argument of db.collection.find()
`sort`|`object` *optional*|A document, describing the sort order, matching the syntax of the sort argument of cursor.sort()

---
#### Tool: **`insert-many`**
Insert an array of documents into a MongoDB collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`documents`|`array`|The array of documents to insert, matching the syntax of the document argument of db.collection.insertMany()

---
#### Tool: **`list-collections`**
List all collections for a given database
Parameters|Type|Description
-|-|-
`database`|`string`|Database name

---
#### Tool: **`list-databases`**
List all databases for a MongoDB connection
#### Tool: **`mongodb-logs`**
Returns the most recent logged mongod events
Parameters|Type|Description
-|-|-
`limit`|`integer` *optional*|The maximum number of log entries to return.
`type`|`string` *optional*|The type of logs to return. Global returns all recent log entries, while startupWarnings returns only warnings and errors from when the process started.

---
#### Tool: **`rename-collection`**
Renames a collection in a MongoDB database
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`newName`|`string`|The new name for the collection
`dropTarget`|`boolean` *optional*|If true, drops the target collection if it exists

---
#### Tool: **`switch-connection`**
Switch to a different MongoDB connection. If the user has configured a connection string or has previously called the connect tool, a connection is already established and there's no need to call this tool unless the user has explicitly requested to switch to a new instance.
Parameters|Type|Description
-|-|-
`connectionString`|`string` *optional*|MongoDB connection string to switch to (in the mongodb:// or mongodb+srv:// format)

---
#### Tool: **`update-many`**
Updates all documents that match the specified filter for a collection
Parameters|Type|Description
-|-|-
`collection`|`string`|Collection name
`database`|`string`|Database name
`update`|`object`|An update document describing the modifications to apply using update operator expressions
`filter`|`object` *optional*|The selection criteria for the update, matching the syntax of the filter argument of db.collection.updateOne()
`upsert`|`boolean` *optional*|Controls whether to insert a new document if no documents match the filter

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "MDB_MCP_CONNECTION_STRING",
        "mcp/mongodb"
      ],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb+srv://username:password@cluster.mongodb.net/myDatabase"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

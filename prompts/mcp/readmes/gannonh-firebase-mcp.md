# gannonh-firebase-mcp MCP Server

🔥 Model Context Protocol (MCP) server to interact with Firebase services.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [gannonh](https://github.com/gannonh) |
| **Repository** | https://github.com/gannonh/firebase-mcp |
| **Dockerfile** | https://github.com/gannonh/firebase-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`auth_get_user`**: Get a user by ID or email from Firebase Authentication
 1. **`firestore_add_document`**: Add a document to a Firestore collection
 1. **`firestore_delete_document`**: Delete a document from a Firestore collection
 1. **`firestore_get_document`**: Get a document from a Firestore collection
 1. **`firestore_list_collections`**: List root collections in Firestore
 1. **`firestore_list_documents`**: List documents from a Firestore collection with filtering and ordering
 1. **`firestore_query_collection_group`**: Query documents across all subcollections with the same name (collection group query)
 1. **`firestore_update_document`**: Update a document in a Firestore collection
 1. **`storage_get_file_info`**: Get file information including metadata and download URL
 1. **`storage_list_files`**: List files in a given path in Firebase Storage

## Tools

### Tool: **`auth_get_user`**

Get a user by ID or email from Firebase Authentication

| Parameter | Type | Description |
| - | - | - |
| `identifier` | `string` | User ID or email address |

### Tool: **`firestore_add_document`**

Add a document to a Firestore collection

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Collection name |
| `data` | `object` | Document data |

### Tool: **`firestore_delete_document`**

Delete a document from a Firestore collection

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Collection name |
| `id` | `string` | Document ID |

### Tool: **`firestore_get_document`**

Get a document from a Firestore collection

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Collection name |
| `id` | `string` | Document ID |

### Tool: **`firestore_list_collections`**

List root collections in Firestore

### Tool: **`firestore_list_documents`**

List documents from a Firestore collection with filtering and ordering

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Collection name |
| `filters` | `array` *optional* | Array of filter conditions |
| `limit` | `number` *optional* | Number of documents to return |
| `orderBy` | `array` *optional* | Array of fields to order by |
| `pageToken` | `string` *optional* | Token for pagination to get the next page of results |

### Tool: **`firestore_query_collection_group`**

Query documents across all subcollections with the same name (collection group query)

| Parameter | Type | Description |
| - | - | - |
| `collectionId` | `string` | The collection ID to query across all documents (without parent path) |
| `filters` | `array` *optional* | Optional filters to apply to the query |
| `limit` | `number` *optional* | Maximum number of documents to return (default: 20, max: 100) |
| `orderBy` | `array` *optional* | Optional fields to order results by |
| `pageToken` | `string` *optional* | Token for pagination (document path to start after) |

### Tool: **`firestore_update_document`**

Update a document in a Firestore collection

| Parameter | Type | Description |
| - | - | - |
| `collection` | `string` | Collection name |
| `data` | `object` | Updated document data |
| `id` | `string` | Document ID |

### Tool: **`storage_get_file_info`**

Get file information including metadata and download URL

| Parameter | Type | Description |
| - | - | - |
| `filePath` | `string` | The path of the file to get information for |

### Tool: **`storage_list_files`**

List files in a given path in Firebase Storage

| Parameter | Type | Description |
| - | - | - |
| `directoryPath` | `string` *optional* | The optional path to list files from. If not provided, the root is used. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "gannonh-firebase-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/gannonh-firebase-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/gannonh-firebase-mcp -f Dockerfile https://github.com/gannonh/firebase-mcp.git
```


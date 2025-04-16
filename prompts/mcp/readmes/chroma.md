# Chroma MCP Server

A Model Context Protocol (MCP) server implementation that provides database capabilities for Chroma

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[chroma-core](https://github.com/chroma-core)
**Repository**|https://github.com/chroma-core/chroma-mcp
**Dockerfile**|https://github.com/chroma-core/chroma-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/chroma)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`chroma_add_documents`|Add documents to a Chroma collection.|
`chroma_create_collection`|Create a new Chroma collection with configurable HNSW parameters.|
`chroma_delete_collection`|Delete a Chroma collection.|
`chroma_delete_documents`|Delete documents from a Chroma collection.|
`chroma_get_collection_count`|Get the number of documents in a Chroma collection.|
`chroma_get_collection_info`|Get information about a Chroma collection.|
`chroma_get_documents`|Get documents from a Chroma collection with optional filtering.|
`chroma_list_collections`|List all collection names in the Chroma database with pagination support.|
`chroma_modify_collection`|Modify a Chroma collection's name or metadata.|
`chroma_peek_collection`|Peek at documents in a Chroma collection.|
`chroma_query_documents`|Query documents from a Chroma collection with advanced filtering.|
`chroma_update_documents`|Update documents in a Chroma collection.|

---
## Tools Details

#### Tool: **`chroma_add_documents`**
Add documents to a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to add documents to
`documents`|`array`|List of text documents to add
`ids`|`string` *optional*|Optional list of IDs for the documents
`metadatas`|`string` *optional*|Optional list of metadata dictionaries for each document

---
#### Tool: **`chroma_create_collection`**
Create a new Chroma collection with configurable HNSW parameters.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to create
`batch_size`|`string` *optional*|Number of elements to batch together during index construction
`ef_construction`|`string` *optional*|Size of the dynamic candidate list for constructing the HNSW graph
`ef_search`|`string` *optional*|Size of the dynamic candidate list for searching the HNSW graph
`embedding_function_name`|`string` *optional*|Name of the embedding function to use. Options: 'default', 'cohere', 'openai', 'jina', 'voyageai', 'ollama', 'roboflow'
`max_neighbors`|`string` *optional*|Maximum number of neighbors to consider during HNSW graph construction
`metadata`|`string` *optional*|Optional metadata dict to add to the collection
`num_threads`|`string` *optional*|Number of threads to use during HNSW construction
`resize_factor`|`string` *optional*|Factor to resize the index by when it's full
`space`|`string` *optional*|Distance function used in HNSW index. Options: 'l2', 'ip', 'cosine'
`sync_threshold`|`string` *optional*|Number of elements to process before syncing index to disk

---
#### Tool: **`chroma_delete_collection`**
Delete a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to delete

---
#### Tool: **`chroma_delete_documents`**
Delete documents from a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to delete documents from
`ids`|`array`|List of document IDs to delete

---
#### Tool: **`chroma_get_collection_count`**
Get the number of documents in a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to count

---
#### Tool: **`chroma_get_collection_info`**
Get information about a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to get info about

---
#### Tool: **`chroma_get_documents`**
Get documents from a Chroma collection with optional filtering.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to get documents from
`ids`|`string` *optional*|Optional list of document IDs to retrieve
`include`|`array` *optional*|List of what to include in response. By default, this will include documents, and metadatas.
`limit`|`string` *optional*|Optional maximum number of documents to return
`offset`|`string` *optional*|Optional number of documents to skip before returning results
`where`|`string` *optional*|Optional metadata filters using Chroma's query operators
`where_document`|`string` *optional*|Optional document content filters

---
#### Tool: **`chroma_list_collections`**
List all collection names in the Chroma database with pagination support.
Parameters|Type|Description
-|-|-
`limit`|`string` *optional*|Optional maximum number of collections to return
`offset`|`string` *optional*|Optional number of collections to skip before returning results

---
#### Tool: **`chroma_modify_collection`**
Modify a Chroma collection's name or metadata.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to modify
`batch_size`|`string` *optional*|Number of elements to batch together during index construction
`ef_search`|`string` *optional*|Size of the dynamic candidate list for searching the HNSW graph
`new_metadata`|`string` *optional*|Optional new metadata for the collection
`new_name`|`string` *optional*|Optional new name for the collection
`num_threads`|`string` *optional*|Number of threads to use during HNSW construction
`resize_factor`|`string` *optional*|Factor to resize the index by when it's full
`sync_threshold`|`string` *optional*|Number of elements to process before syncing index to disk

---
#### Tool: **`chroma_peek_collection`**
Peek at documents in a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to peek into
`limit`|`integer` *optional*|Number of documents to peek at

---
#### Tool: **`chroma_query_documents`**
Query documents from a Chroma collection with advanced filtering.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to query
`query_texts`|`array`|List of query texts to search for
`include`|`array` *optional*|List of what to include in response. By default, this will include documents, metadatas, and distances.
`n_results`|`integer` *optional*|Number of results to return per query
`where`|`string` *optional*|Optional metadata filters using Chroma's query operators
`where_document`|`string` *optional*|Optional document content filters

---
#### Tool: **`chroma_update_documents`**
Update documents in a Chroma collection.
Parameters|Type|Description
-|-|-
`collection_name`|`string`|Name of the collection to update documents in
`ids`|`array`|List of document IDs to update (required)
`documents`|`string` *optional*|Optional list of new text documents.
`embeddings`|`string` *optional*|Optional list of new embeddings for the documents.
`metadatas`|`string` *optional*|Optional list of new metadata dictionaries for the documents.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "chroma": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CHROMA_API_KEY",
        "mcp/chroma"
      ],
      "env": {
        "CHROMA_API_KEY": "your-api-key"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

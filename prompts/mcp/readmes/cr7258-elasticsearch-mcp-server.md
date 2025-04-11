# cr7258-elasticsearch-mcp-server MCP Server

A Model Context Protocol (MCP) server implementation that provides Elasticsearch and OpenSearch interaction.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [cr7258](https://github.com/cr7258) |
| **Repository** | https://github.com/cr7258/elasticsearch-mcp-server |
| **Dockerfile** | https://github.com/cr7258/elasticsearch-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`create_index`**: Create a new index.
 1. **`delete_alias`**: Delete an alias for a specific index.
 1. **`delete_by_query`**: Deletes documents matching the provided query.
 1. **`delete_document`**: Delete a document by ID.
 1. **`delete_index`**: Delete an index.
 1. **`get_alias`**: Get alias information for a specific index.
 1. **`get_cluster_health`**: Returns basic information about the health of the cluster.
 1. **`get_cluster_stats`**: Returns high-level overview of cluster statistics.
 1. **`get_document`**: Get a document by ID.
 1. **`get_index`**: Returns information (mappings, settings, aliases) about one or more indices.
 1. **`index_document`**: Creates or updates a document in the index.
 1. **`list_aliases`**: List all aliases.
 1. **`list_indices`**: List all indices.
 1. **`put_alias`**: Create or update an alias for a specific index.
 1. **`search_documents`**: Search for documents.

## Tools

### Tool: **`create_index`**

Create a new index.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the index |
| `body` | `string` *optional* | Optional index configuration including mappings and settings |

### Tool: **`delete_alias`**

Delete an alias for a specific index.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the index |
| `name` | `string` | Name of the alias |

### Tool: **`delete_by_query`**

Deletes documents matching the provided query.

| Parameter | Type | Description |
| - | - | - |
| `body` | `object` | Query to match documents for deletion |
| `index` | `string` | Name of the index |

### Tool: **`delete_document`**

Delete a document by ID.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Document ID |
| `index` | `string` | Name of the index |

### Tool: **`delete_index`**

Delete an index.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the index |

### Tool: **`get_alias`**

Get alias information for a specific index.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the index |

### Tool: **`get_cluster_health`**

Returns basic information about the health of the cluster.

### Tool: **`get_cluster_stats`**

Returns high-level overview of cluster statistics.

### Tool: **`get_document`**

Get a document by ID.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Document ID |
| `index` | `string` | Name of the index |

### Tool: **`get_index`**

Returns information (mappings, settings, aliases) about one or more indices.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the index |

### Tool: **`index_document`**

Creates or updates a document in the index.

| Parameter | Type | Description |
| - | - | - |
| `document` | `object` | Document data |
| `index` | `string` | Name of the index |
| `id` | `string` *optional* | Optional document ID |

### Tool: **`list_aliases`**

List all aliases.

### Tool: **`list_indices`**

List all indices.

### Tool: **`put_alias`**

Create or update an alias for a specific index.

| Parameter | Type | Description |
| - | - | - |
| `body` | `object` | Alias configuration |
| `index` | `string` | Name of the index |
| `name` | `string` | Name of the alias |

### Tool: **`search_documents`**

Search for documents.

| Parameter | Type | Description |
| - | - | - |
| `body` | `object` | Search query |
| `index` | `string` | Name of the index |

## Use this MCP Server

```json
{
  "mcpServers": {
    "cr7258-elasticsearch-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/cr7258-elasticsearch-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/cr7258-elasticsearch-mcp-server -f Dockerfile https://github.com/cr7258/elasticsearch-mcp-server.git
```


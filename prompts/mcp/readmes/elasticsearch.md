# elasticsearch MCP Server

Interact with your Elasticsearch indices through natural language conversations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [elastic](https://github.com/elastic) |
| **Repository** | https://github.com/elastic/mcp-server-elasticsearch |
| **Dockerfile** | https://github.com/elastic/mcp-server-elasticsearch/blob/refs/pull/37/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`get_mappings`**: Get field mappings for a specific Elasticsearch index
 1. **`get_shards`**: Get shard information for all or specific indices
 1. **`list_indices`**: List all available Elasticsearch indices
 1. **`search`**: Perform an Elasticsearch search with the provided query DSL. Highlights are always enabled.

## Tools

### Tool: **`get_mappings`**

Get field mappings for a specific Elasticsearch index

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the Elasticsearch index to get mappings for |

### Tool: **`get_shards`**

Get shard information for all or specific indices

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` *optional* | Optional index name to get shard information for |

### Tool: **`list_indices`**

List all available Elasticsearch indices

### Tool: **`search`**

Perform an Elasticsearch search with the provided query DSL. Highlights are always enabled.

| Parameter | Type | Description |
| - | - | - |
| `index` | `string` | Name of the Elasticsearch index to search |
| `queryBody` | `object` | Complete Elasticsearch query DSL object that can include query, size, from, sort, etc. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "elasticsearch": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ES_URL",
        "-e",
        "ES_API_KEY",
        "mcp/elasticsearch"
      ],
      "env": {
        "ES_URL": "http://localhost:9200",
        "ES_API_KEY": "your-api-key"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/elasticsearch -f Dockerfile https://github.com/elastic/mcp-server-elasticsearch.git#refs/pull/37/merge
```


# Elasticsearch MCP Server

Interact with your Elasticsearch indices through natural language conversations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[elastic](https://github.com/elastic)
**Repository**|https://github.com/elastic/mcp-server-elasticsearch
**Dockerfile**|https://github.com/elastic/mcp-server-elasticsearch/blob/refs/pull/37/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_mappings`|Get field mappings for a specific Elasticsearch index|
`get_shards`|Get shard information for all or specific indices|
`list_indices`|List all available Elasticsearch indices|
`search`|Perform an Elasticsearch search with the provided query DSL.|

---
## Tools Details

#### Tool: `get_mappings`
|Description|
|-|
|Get field mappings for a specific Elasticsearch index|

Parameters|Type|Description
-|-|-
`index`|`string`|Name of the Elasticsearch index to get mappings for

---
#### Tool: `get_shards`
|Description|
|-|
|Get shard information for all or specific indices|

Parameters|Type|Description
-|-|-
`index`|`string` *optional*|Optional index name to get shard information for

---
#### Tool: `list_indices`
|Description|
|-|
|List all available Elasticsearch indices|

#### Tool: `search`
|Description|
|-|
|Perform an Elasticsearch search with the provided query DSL. Highlights are always enabled.|

Parameters|Type|Description
-|-|-
`index`|`string`|Name of the Elasticsearch index to search
`queryBody`|`object`|Complete Elasticsearch query DSL object that can include query, size, from, sort, etc.

---
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

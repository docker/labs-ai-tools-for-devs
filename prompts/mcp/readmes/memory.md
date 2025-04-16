# Memory MCP Server

Knowledge graph-based persistent memory system

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/memory/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`add_observations`|Add new observations to existing entities in the knowledge graph|
`create_entities`|Create multiple new entities in the knowledge graph|
`create_relations`|Create multiple new relations between entities in the knowledge graph.|
`delete_entities`|Delete multiple entities and their associated relations from the knowledge graph|
`delete_observations`|Delete specific observations from entities in the knowledge graph|
`delete_relations`|Delete multiple relations from the knowledge graph|
`open_nodes`|Open specific nodes in the knowledge graph by their names|
`read_graph`|Read the entire knowledge graph|
`search_nodes`|Search for nodes in the knowledge graph based on a query|

---
## Tools Details

#### Tool: **`add_observations`**
Add new observations to existing entities in the knowledge graph
Parameters|Type|Description
-|-|-
`observations`|`array`|

---
#### Tool: **`create_entities`**
Create multiple new entities in the knowledge graph
Parameters|Type|Description
-|-|-
`entities`|`array`|

---
#### Tool: **`create_relations`**
Create multiple new relations between entities in the knowledge graph. Relations should be in active voice
Parameters|Type|Description
-|-|-
`relations`|`array`|

---
#### Tool: **`delete_entities`**
Delete multiple entities and their associated relations from the knowledge graph
Parameters|Type|Description
-|-|-
`entityNames`|`array`|An array of entity names to delete

---
#### Tool: **`delete_observations`**
Delete specific observations from entities in the knowledge graph
Parameters|Type|Description
-|-|-
`deletions`|`array`|

---
#### Tool: **`delete_relations`**
Delete multiple relations from the knowledge graph
Parameters|Type|Description
-|-|-
`relations`|`array`|An array of relations to delete

---
#### Tool: **`open_nodes`**
Open specific nodes in the knowledge graph by their names
Parameters|Type|Description
-|-|-
`names`|`array`|An array of entity names to retrieve

---
#### Tool: **`read_graph`**
Read the entire knowledge graph
#### Tool: **`search_nodes`**
Search for nodes in the knowledge graph based on a query
Parameters|Type|Description
-|-|-
`query`|`string`|The search query to match against entity names, types, and observation content

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "memory": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/memory"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

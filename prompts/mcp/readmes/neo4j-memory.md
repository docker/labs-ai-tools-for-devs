# Neo4j Memory MCP Server

Provide persistent memory capabilities through Neo4j graph database integration.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/neo4j-memory](https://hub.docker.com/repository/docker/mcp/neo4j-memory)
**Author**|[neo4j-contrib](https://github.com/neo4j-contrib)
**Repository**|https://github.com/neo4j-contrib/mcp-neo4j
**Dockerfile**|https://github.com/neo4j-contrib/mcp-neo4j/blob/main/servers/mcp-neo4j-memory/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/neo4j-memory)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/neo4j-memory --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
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
`find_nodes`|Open specific nodes in the knowledge graph by their names|
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
#### Tool: **`find_nodes`**
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
    "neo4j-memory": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "NEO4J_URL",
        "-e",
        "NEO4J_USERNAME",
        "-e",
        "NEO4J_PASSWORD",
        "mcp/neo4j-memory"
      ],
      "env": {
        "NEO4J_URL": "bolt://host.docker.internal:7687",
        "NEO4J_USERNAME": "neo4j",
        "NEO4J_PASSWORD": "password"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

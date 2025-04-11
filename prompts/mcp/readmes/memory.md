# memory MCP Server

Knowledge graph-based persistent memory system

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/memory/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add_observations`**: Add new observations to existing entities in the knowledge graph
 1. **`create_entities`**: Create multiple new entities in the knowledge graph
 1. **`create_relations`**: Create multiple new relations between entities in the knowledge graph. Relations should be in active voice
 1. **`delete_entities`**: Delete multiple entities and their associated relations from the knowledge graph
 1. **`delete_observations`**: Delete specific observations from entities in the knowledge graph
 1. **`delete_relations`**: Delete multiple relations from the knowledge graph
 1. **`open_nodes`**: Open specific nodes in the knowledge graph by their names
 1. **`read_graph`**: Read the entire knowledge graph
 1. **`search_nodes`**: Search for nodes in the knowledge graph based on a query

## Tools

### Tool: **`add_observations`**

Add new observations to existing entities in the knowledge graph

| Parameter | Type | Description |
| - | - | - |
| `observations` | `array` |  |

### Tool: **`create_entities`**

Create multiple new entities in the knowledge graph

| Parameter | Type | Description |
| - | - | - |
| `entities` | `array` |  |

### Tool: **`create_relations`**

Create multiple new relations between entities in the knowledge graph. Relations should be in active voice

| Parameter | Type | Description |
| - | - | - |
| `relations` | `array` |  |

### Tool: **`delete_entities`**

Delete multiple entities and their associated relations from the knowledge graph

| Parameter | Type | Description |
| - | - | - |
| `entityNames` | `array` | An array of entity names to delete |

### Tool: **`delete_observations`**

Delete specific observations from entities in the knowledge graph

| Parameter | Type | Description |
| - | - | - |
| `deletions` | `array` |  |

### Tool: **`delete_relations`**

Delete multiple relations from the knowledge graph

| Parameter | Type | Description |
| - | - | - |
| `relations` | `array` | An array of relations to delete |

### Tool: **`open_nodes`**

Open specific nodes in the knowledge graph by their names

| Parameter | Type | Description |
| - | - | - |
| `names` | `array` | An array of entity names to retrieve |

### Tool: **`read_graph`**

Read the entire knowledge graph

### Tool: **`search_nodes`**

Search for nodes in the knowledge graph based on a query

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The search query to match against entity names, types, and observation content |

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

## Rebuild this image

```console
docker build -t mcp/memory -f src/memory/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


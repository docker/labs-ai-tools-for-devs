# Neo4j Cypher MCP Server

Interact with Neo4j using Cypher graph queries.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/neo4j-cypher](https://hub.docker.com/repository/docker/mcp/neo4j-cypher)
**Author**|[neo4j-contrib](https://github.com/neo4j-contrib)
**Repository**|https://github.com/neo4j-contrib/mcp-neo4j
**Dockerfile**|https://github.com/neo4j-contrib/mcp-neo4j/blob/main/servers/mcp-neo4j-cypher/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/neo4j-cypher)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/neo4j-cypher --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_neo4j_schema`|List all node, their attributes and their relationships to other nodes in the neo4j database.|
`read_neo4j_cypher`|Execute a read Cypher query on the neo4j database.|
`write_neo4j_cypher`|Execute a write Cypher query on the neo4j database.|

---
## Tools Details

#### Tool: **`get_neo4j_schema`**
List all node, their attributes and their relationships to other nodes in the neo4j database.
        If this fails with a message that includes "Neo.ClientError.Procedure.ProcedureNotFound"
        suggest that the user install and enable the APOC plugin.
#### Tool: **`read_neo4j_cypher`**
Execute a read Cypher query on the neo4j database.
Parameters|Type|Description
-|-|-
`query`|`string`|The Cypher query to execute.
`params`|`string` *optional*|The parameters to pass to the Cypher query.

---
#### Tool: **`write_neo4j_cypher`**
Execute a write Cypher query on the neo4j database.
Parameters|Type|Description
-|-|-
`query`|`string`|The Cypher query to execute.
`params`|`string` *optional*|The parameters to pass to the Cypher query.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "neo4j-cypher": {
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
        "mcp/neo4j-cypher"
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

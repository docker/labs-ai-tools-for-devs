# Neo4j Cloud Aura Api MCP Server

Manage Neo4j Aura database instances through the Neo4j Aura API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/neo4j-cloud-aura-api](https://hub.docker.com/repository/docker/mcp/neo4j-cloud-aura-api)
**Author**|[neo4j-contrib](https://github.com/neo4j-contrib)
**Repository**|https://github.com/neo4j-contrib/mcp-neo4j
**Dockerfile**|https://github.com/neo4j-contrib/mcp-neo4j/blob/main/servers/mcp-neo4j-cloud-aura-api/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/neo4j-cloud-aura-api)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/neo4j-cloud-aura-api --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_instance`|Create a new Neo4j Aura database instance|
`delete_instance`|Delete a Neo4j Aura database instance|
`get_instance_by_name`|Find a Neo4j Aura instance by name and returns the details including the id|
`get_instance_details`|Get details for one or more Neo4j Aura instances by ID, including status, region, memory, storage|
`get_tenant_details`|Get details for a specific Neo4j Aura tenant/project|
`list_instances`|List all Neo4j Aura database instances|
`list_tenants`|List all Neo4j Aura tenants/projects|
`pause_instance`|Pause a Neo4j Aura database instance|
`resume_instance`|Resume a paused Neo4j Aura database instance|
`update_instance_memory`|Update the memory allocation of a Neo4j Aura instance|
`update_instance_name`|Update the name of a Neo4j Aura instance|
`update_instance_vector_optimization`|Update the vector optimization setting of a Neo4j Aura instance|

---
## Tools Details

#### Tool: **`create_instance`**
Create a new Neo4j Aura database instance
Parameters|Type|Description
-|-|-
`name`|`string`|Name for the new instance
`tenant_id`|`string`|ID of the tenant/project where the instance will be created
`cloud_provider`|`string` *optional*|Cloud provider (gcp, aws, azure)
`graph_analytics_plugin`|`boolean` *optional*|Whether to enable the graph analytics plugin
`memory`|`integer` *optional*|Memory allocation in GB
`region`|`string` *optional*|Region for the instance (e.g., 'us-central1')
`source_instance_id`|`string` *optional*|ID of the source instance to clone from (for professional/enterprise instances)
`type`|`string` *optional*|Instance type (free-db, professional-db, enterprise-db, or business-critical)
`vector_optimized`|`boolean` *optional*|Whether the instance is optimized for vector operations. Only allowed for instance with more than 4GB memory.

---
#### Tool: **`delete_instance`**
Delete a Neo4j Aura database instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to delete

---
#### Tool: **`get_instance_by_name`**
Find a Neo4j Aura instance by name and returns the details including the id
Parameters|Type|Description
-|-|-
`name`|`string`|Name of the instance to find

---
#### Tool: **`get_instance_details`**
Get details for one or more Neo4j Aura instances by ID, including status, region, memory, storage
Parameters|Type|Description
-|-|-
`instance_ids`|`array`|List of instance IDs to retrieve

---
#### Tool: **`get_tenant_details`**
Get details for a specific Neo4j Aura tenant/project
Parameters|Type|Description
-|-|-
`tenant_id`|`string`|ID of the tenant/project to retrieve

---
#### Tool: **`list_instances`**
List all Neo4j Aura database instances
#### Tool: **`list_tenants`**
List all Neo4j Aura tenants/projects
#### Tool: **`pause_instance`**
Pause a Neo4j Aura database instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to pause

---
#### Tool: **`resume_instance`**
Resume a paused Neo4j Aura database instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to resume

---
#### Tool: **`update_instance_memory`**
Update the memory allocation of a Neo4j Aura instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to update
`memory`|`integer`|New memory allocation in GB

---
#### Tool: **`update_instance_name`**
Update the name of a Neo4j Aura instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to update
`name`|`string`|New name for the instance

---
#### Tool: **`update_instance_vector_optimization`**
Update the vector optimization setting of a Neo4j Aura instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|ID of the instance to update
`vector_optimized`|`boolean`|Whether the instance should be optimized for vector operations

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "neo4j-cloud-aura-api": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "NEO4J_AURA_CLIENT_ID",
        "-e",
        "NEO4J_AURA_CLIENT_SECRET",
        "mcp/neo4j-cloud-aura-api"
      ],
      "env": {
        "NEO4J_AURA_CLIENT_ID": "<your-client-id>",
        "NEO4J_AURA_CLIENT_SECRET": "<your-client-secret>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

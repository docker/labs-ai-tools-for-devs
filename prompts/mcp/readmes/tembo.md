# Tembo MCP Server

MCP server for Tembo Cloud's platform API

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[tembo-io](https://github.com/tembo-io)
**Repository**|https://github.com/tembo-io/mcp-server-tembo
**Dockerfile**|https://github.com/tembo-io/mcp-server-tembo/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`ask_tembo`|Ask a question to Tembo Docs|
`create_instance`|Create a new Tembo instance|
`delete_instance`|Delete an existing Tembo instance|
`get_all_apps`|Get attributes for all apps|
`get_all_instances`|Get all Tembo instances in an organization|
`get_app`|Get the attributes of a single App|
`get_instance`|Get an existing Tembo instance|
`get_instance_schema`|Get the json-schema for an instance|
`patch_instance`|Update attributes on an existing Tembo instance|
`restore_instance`|Restore a Tembo instance|

---
## Tools Details

#### Tool: **`ask_tembo`**
Ask a question to Tembo Docs
Parameters|Type|Description
-|-|-
`query`|`string`|The ask query. For example, "how to create a Tembo instance"

---
#### Tool: **`create_instance`**
Create a new Tembo instance
Parameters|Type|Description
-|-|-
`cpu`|`string`|
`environment`|`string`|
`instance_name`|`string`|
`memory`|`string`|
`org_id`|`string`|Organization ID that owns the Tembo instance
`stack_type`|`string`|
`storage`|`string`|
`replicas`|`integer` *optional*|
`spot`|`boolean` *optional*|

---
#### Tool: **`delete_instance`**
Delete an existing Tembo instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|Delete this instance id
`org_id`|`string`|Organization id of the instance to delete

---
#### Tool: **`get_all_apps`**
Get attributes for all apps
#### Tool: **`get_all_instances`**
Get all Tembo instances in an organization
Parameters|Type|Description
-|-|-
`org_id`|`string`|Organization id for the request

---
#### Tool: **`get_app`**
Get the attributes of a single App
Parameters|Type|Description
-|-|-
`type`|`string`|The app type to get details for

---
#### Tool: **`get_instance`**
Get an existing Tembo instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|
`org_id`|`string`|Organization ID that owns the instance

---
#### Tool: **`get_instance_schema`**
Get the json-schema for an instance
#### Tool: **`patch_instance`**
Update attributes on an existing Tembo instance
Parameters|Type|Description
-|-|-
`instance_id`|`string`|
`org_id`|`string`|Organization ID that owns the instance
`cpu`|`string` *optional*|
`environment`|`string` *optional*|
`instance_name`|`string` *optional*|
`memory`|`string` *optional*|
`replicas`|`integer` *optional*|
`spot`|`boolean` *optional*|
`storage`|`string` *optional*|

---
#### Tool: **`restore_instance`**
Restore a Tembo instance
Parameters|Type|Description
-|-|-
`instance_name`|`string`|
`org_id`|`string`|Organization ID that owns the Tembo instance
`restore`|`object`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "tembo": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TEMBO_API_KEY",
        "mcp/tembo"
      ],
      "env": {
        "TEMBO_API_KEY": "your-tembo-apikey-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

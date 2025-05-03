# Webflow MCP Server

Model Context Protocol (MCP) server for the Webflow Data API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/webflow](https://hub.docker.com/repository/docker/mcp/webflow)
**Author**|[webflow](https://github.com/webflow)
**Repository**|https://github.com/webflow/mcp-server
**Dockerfile**|https://github.com/slimslenderslacks/mcp-server/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/webflow)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/webflow --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`collection_fields_create_option`||
`collection_fields_create_reference`||
`collection_fields_create_static`||
`collection_fields_update`||
`collections_create`||
`collections_get`||
`collections_items_create_item`||
`collections_items_create_item_live`||
`collections_items_list_items`||
`collections_items_publish_items`||
`collections_items_update_items`||
`collections_items_update_items_live`||
`collections_list`||
`pages_get_content`||
`pages_get_metadata`||
`pages_list`||
`pages_update_page_settings`||
`pages_update_static_content`||
`sites_get`||
`sites_list`||
`sites_publish`||

---
## Tools Details

#### Tool: **`collection_fields_create_option`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collection_fields_create_reference`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collection_fields_create_static`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collection_fields_update`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`field_id`|`string`|
`request`|`object`|

---
#### Tool: **`collections_create`**

Parameters|Type|Description
-|-|-
`request`|`object`|
`site_id`|`string`|

---
#### Tool: **`collections_get`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|

---
#### Tool: **`collections_items_create_item`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collections_items_create_item_live`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collections_items_list_items`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`cmsLocaleId`|`string` *optional*|
`limit`|`number` *optional*|
`name`|`string` *optional*|
`offset`|`number` *optional*|
`slug`|`string` *optional*|
`sortBy`|`string` *optional*|
`sortOrder`|`string` *optional*|

---
#### Tool: **`collections_items_publish_items`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`itemIds`|`array`|

---
#### Tool: **`collections_items_update_items`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collections_items_update_items_live`**

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: **`collections_list`**

Parameters|Type|Description
-|-|-
`site_id`|`string`|

---
#### Tool: **`pages_get_content`**

Parameters|Type|Description
-|-|-
`page_id`|`string`|
`limit`|`number` *optional*|
`localeId`|`string` *optional*|
`offset`|`number` *optional*|

---
#### Tool: **`pages_get_metadata`**

Parameters|Type|Description
-|-|-
`page_id`|`string`|
`localeId`|`string` *optional*|

---
#### Tool: **`pages_list`**

Parameters|Type|Description
-|-|-
`site_id`|`string`|
`limit`|`number` *optional*|
`localeId`|`string` *optional*|
`offset`|`number` *optional*|

---
#### Tool: **`pages_update_page_settings`**

Parameters|Type|Description
-|-|-
`body`|`object`|
`page_id`|`string`|
`localeId`|`string` *optional*|

---
#### Tool: **`pages_update_static_content`**

Parameters|Type|Description
-|-|-
`localeId`|`string`|
`nodes`|`array`|
`page_id`|`string`|

---
#### Tool: **`sites_get`**

Parameters|Type|Description
-|-|-
`site_id`|`string`|

---
#### Tool: **`sites_list`**

#### Tool: **`sites_publish`**

Parameters|Type|Description
-|-|-
`site_id`|`string`|
`customDomains`|`array` *optional*|
`publishToWebflowSubdomain`|`boolean` *optional*|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "webflow": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "WEBFLOW_TOKEN",
        "mcp/webflow"
      ],
      "env": {
        "WEBFLOW_TOKEN": "your_api_token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

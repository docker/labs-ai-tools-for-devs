# Webflow MCP Server

Model Context Protocol (MCP) server for the Webflow Data API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[slimslenderslacks](https://github.com/slimslenderslacks)
**Repository**|https://github.com/slimslenderslacks/mcp-server
**Dockerfile**|https://github.com/slimslenderslacks/mcp-server/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
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

#### Tool: `collection_fields_create_option`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collection_fields_create_reference`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collection_fields_create_static`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collection_fields_update`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`field_id`|`string`|
`request`|`object`|

---
#### Tool: `collections_create`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`request`|`object`|
`site_id`|`string`|

---
#### Tool: `collections_get`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|

---
#### Tool: `collections_items_create_item`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collections_items_create_item_live`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collections_items_list_items`
|Description|
|-|
||

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
#### Tool: `collections_items_publish_items`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`itemIds`|`array`|

---
#### Tool: `collections_items_update_items`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collections_items_update_items_live`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`collection_id`|`string`|
`request`|`object`|

---
#### Tool: `collections_list`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`site_id`|`string`|

---
#### Tool: `pages_get_content`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`page_id`|`string`|
`limit`|`number` *optional*|
`localeId`|`string` *optional*|
`offset`|`number` *optional*|

---
#### Tool: `pages_get_metadata`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`page_id`|`string`|
`localeId`|`string` *optional*|

---
#### Tool: `pages_list`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`site_id`|`string`|
`limit`|`number` *optional*|
`localeId`|`string` *optional*|
`offset`|`number` *optional*|

---
#### Tool: `pages_update_page_settings`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`body`|`object`|
`page_id`|`string`|
`localeId`|`string` *optional*|

---
#### Tool: `pages_update_static_content`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`localeId`|`string`|
`nodes`|`array`|
`page_id`|`string`|

---
#### Tool: `sites_get`
|Description|
|-|
||

Parameters|Type|Description
-|-|-
`site_id`|`string`|

---
#### Tool: `sites_list`
|Description|
|-|
||

#### Tool: `sites_publish`
|Description|
|-|
||

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

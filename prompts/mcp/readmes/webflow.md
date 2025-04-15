# webflow MCP Server

Model Context Protocol (MCP) server for the Webflow Data API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [slimslenderslacks](https://github.com/slimslenderslacks) |
| **Repository** | https://github.com/slimslenderslacks/mcp-server |
| **Dockerfile** | https://github.com/slimslenderslacks/mcp-server/blob/slim/docker/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`collection_fields_create_option`**: 
 1. **`collection_fields_create_reference`**: 
 1. **`collection_fields_create_static`**: 
 1. **`collection_fields_update`**: 
 1. **`collections_create`**: 
 1. **`collections_get`**: 
 1. **`collections_items_create_item`**: 
 1. **`collections_items_create_item_live`**: 
 1. **`collections_items_list_items`**: 
 1. **`collections_items_publish_items`**: 
 1. **`collections_items_update_items`**: 
 1. **`collections_items_update_items_live`**: 
 1. **`collections_list`**: 
 1. **`pages_get_content`**: 
 1. **`pages_get_metadata`**: 
 1. **`pages_list`**: 
 1. **`pages_update_page_settings`**: 
 1. **`pages_update_static_content`**: 
 1. **`sites_get`**: 
 1. **`sites_list`**: 
 1. **`sites_publish`**: 

## Tools

### Tool: **`collection_fields_create_option`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collection_fields_create_reference`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collection_fields_create_static`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collection_fields_update`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `field_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collections_create`**



| Parameter | Type | Description |
| - | - | - |
| `request` | `object` |  |
| `site_id` | `string` |  |

### Tool: **`collections_get`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |

### Tool: **`collections_items_create_item`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collections_items_create_item_live`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collections_items_list_items`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `cmsLocaleId` | `string` *optional* |  |
| `limit` | `number` *optional* |  |
| `name` | `string` *optional* |  |
| `offset` | `number` *optional* |  |
| `slug` | `string` *optional* |  |
| `sortBy` | `string` *optional* |  |
| `sortOrder` | `string` *optional* |  |

### Tool: **`collections_items_publish_items`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `itemIds` | `array` |  |

### Tool: **`collections_items_update_items`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collections_items_update_items_live`**



| Parameter | Type | Description |
| - | - | - |
| `collection_id` | `string` |  |
| `request` | `object` |  |

### Tool: **`collections_list`**



| Parameter | Type | Description |
| - | - | - |
| `site_id` | `string` |  |

### Tool: **`pages_get_content`**



| Parameter | Type | Description |
| - | - | - |
| `page_id` | `string` |  |
| `limit` | `number` *optional* |  |
| `localeId` | `string` *optional* |  |
| `offset` | `number` *optional* |  |

### Tool: **`pages_get_metadata`**



| Parameter | Type | Description |
| - | - | - |
| `page_id` | `string` |  |
| `localeId` | `string` *optional* |  |

### Tool: **`pages_list`**



| Parameter | Type | Description |
| - | - | - |
| `site_id` | `string` |  |
| `limit` | `number` *optional* |  |
| `localeId` | `string` *optional* |  |
| `offset` | `number` *optional* |  |

### Tool: **`pages_update_page_settings`**



| Parameter | Type | Description |
| - | - | - |
| `body` | `object` |  |
| `page_id` | `string` |  |
| `localeId` | `string` *optional* |  |

### Tool: **`pages_update_static_content`**



| Parameter | Type | Description |
| - | - | - |
| `localeId` | `string` |  |
| `nodes` | `array` |  |
| `page_id` | `string` |  |

### Tool: **`sites_get`**



| Parameter | Type | Description |
| - | - | - |
| `site_id` | `string` |  |

### Tool: **`sites_list`**



### Tool: **`sites_publish`**



| Parameter | Type | Description |
| - | - | - |
| `site_id` | `string` |  |
| `customDomains` | `array` *optional* |  |
| `publishToWebflowSubdomain` | `boolean` *optional* |  |

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

## Rebuild this image

```console
docker build -t mcp/webflow -f Dockerfile https://github.com/slimslenderslacks/mcp-server.git#slim/docker
```


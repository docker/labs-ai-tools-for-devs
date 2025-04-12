# notion MCP Server

Official Notion MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [makenotion](https://github.com/makenotion) |
| **Repository** | https://github.com/makenotion/notion-mcp-server |
| **Dockerfile** | https://github.com/makenotion/notion-mcp-server/blob/refs/pull/16/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`API-create-a-comment`**: Create comment
 1. **`API-create-a-database`**: Create a database
 1. **`API-delete-a-block`**: Delete a block
 1. **`API-get-block-children`**: Retrieve block children
 1. **`API-get-self`**: Retrieve your token's bot user
 1. **`API-get-user`**: Retrieve a user
Error Responses:
400: 400
 1. **`API-get-users`**: List all users
Error Responses:
400: 400
 1. **`API-patch-block-children`**: Append block children
 1. **`API-patch-page`**: Update page properties
 1. **`API-post-database-query`**: Query a database
 1. **`API-post-page`**: Create a page
 1. **`API-post-search`**: Search by title
 1. **`API-retrieve-a-block`**: Retrieve a block
 1. **`API-retrieve-a-comment`**: Retrieve comments
 1. **`API-retrieve-a-database`**: Retrieve a database
 1. **`API-retrieve-a-page`**: Retrieve a page
 1. **`API-retrieve-a-page-property`**: Retrieve a page property item
 1. **`API-update-a-block`**: Update a block
 1. **`API-update-a-database`**: Update a database

## Tools

### Tool: **`API-create-a-comment`**

Create comment

| Parameter | Type | Description |
| - | - | - |
| `parent` | `object` | The page that contains the comment |
| `rich_text` | `array` |  |

### Tool: **`API-create-a-database`**

Create a database

| Parameter | Type | Description |
| - | - | - |
| `parent` | `object` |  |
| `properties` | `object` | Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object). |
| `title` | `array` *optional* |  |

### Tool: **`API-delete-a-block`**

Delete a block

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a Notion block |

### Tool: **`API-get-block-children`**

Retrieve block children

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a [block](ref:block) |
| `page_size` | `integer` *optional* | The number of items from the full list desired in the response. Maximum: 100 |
| `start_cursor` | `string` *optional* | If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results. |

### Tool: **`API-get-self`**

Retrieve your token's bot user

### Tool: **`API-get-user`**

Retrieve a user
Error Responses:
400: 400

| Parameter | Type | Description |
| - | - | - |
| `user_id` | `string` |  |

### Tool: **`API-get-users`**

List all users
Error Responses:
400: 400

| Parameter | Type | Description |
| - | - | - |
| `page_size` | `integer` *optional* | The number of items from the full list desired in the response. Maximum: 100 |
| `start_cursor` | `string` *optional* | If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results. |

### Tool: **`API-patch-block-children`**

Append block children

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a [block](ref:block). Also accepts a [page](ref:page) ID. |
| `children` | `array` | Child content to append to a container block as an array of [block objects](ref:block) |
| `after` | `string` *optional* | The ID of the existing block that the new block should be appended after. |

### Tool: **`API-patch-page`**

Update page properties

| Parameter | Type | Description |
| - | - | - |
| `page_id` | `string` | The identifier for the Notion page to be updated. |
| `archived` | `boolean` *optional* |  |
| `cover` | `object` *optional* | A cover image for the page. Only [external file objects](https://developers.notion.com/reference/file-object) are supported. |
| `icon` | `object` *optional* | A page icon for the page. Supported types are [external file object](https://developers.notion.com/reference/file-object) or [emoji object](https://developers.notion.com/reference/emoji-object). |
| `in_trash` | `boolean` *optional* | Set to true to delete a block. Set to false to restore a block. |
| `properties` | `object` *optional* | The property values to update for the page. The keys are the names or IDs of the property and the values are property values. If a page property ID is not included, then it is not changed. |

### Tool: **`API-post-database-query`**

Query a database

| Parameter | Type | Description |
| - | - | - |
| `database_id` | `string` | Identifier for a Notion database. |
| `archived` | `boolean` *optional* |  |
| `filter` | `object` *optional* | When supplied, limits which pages are returned based on the [filter conditions](ref:post-database-query-filter). |
| `filter_properties` | `array` *optional* | A list of page property value IDs associated with the database. Use this param to limit the response to a specific page property value or values for pages that meet the `filter` criteria. |
| `in_trash` | `boolean` *optional* |  |
| `page_size` | `integer` *optional* | The number of items from the full list desired in the response. Maximum: 100 |
| `sorts` | `array` *optional* | When supplied, orders the results based on the provided [sort criteria](ref:post-database-query-sort). |
| `start_cursor` | `string` *optional* | When supplied, returns a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results. |

### Tool: **`API-post-page`**

Create a page

| Parameter | Type | Description |
| - | - | - |
| `parent` | `object` |  |
| `properties` | `object` |  |
| `children` | `array` *optional* | The content to be rendered on the new page, represented as an array of [block objects](https://developers.notion.com/reference/block). |
| `cover` | `string` *optional* | The cover image of the new page, represented as a [file object](https://developers.notion.com/reference/file-object). |
| `icon` | `string` *optional* | The icon of the new page. Either an [emoji object](https://developers.notion.com/reference/emoji-object) or an [external file object](https://developers.notion.com/reference/file-object).. |

### Tool: **`API-post-search`**

Search by title

| Parameter | Type | Description |
| - | - | - |
| `filter` | `object` *optional* | A set of criteria, `value` and `property` keys, that limits the results to either only pages or only databases. Possible `value` values are `"page"` or `"database"`. The only supported `property` value is `"object"`. |
| `page_size` | `integer` *optional* | The number of items from the full list to include in the response. Maximum: `100`. |
| `query` | `string` *optional* | The text that the API compares page and database titles against. |
| `sort` | `object` *optional* | A set of criteria, `direction` and `timestamp` keys, that orders the results. The **only** supported timestamp value is `"last_edited_time"`. Supported `direction` values are `"ascending"` and `"descending"`. If `sort` is not provided, then the most recently edited results are returned first. |
| `start_cursor` | `string` *optional* | A `cursor` value returned in a previous response that If supplied, limits the response to results starting after the `cursor`. If not supplied, then the first page of results is returned. Refer to [pagination](https://developers.notion.com/reference/intro#pagination) for more details. |

### Tool: **`API-retrieve-a-block`**

Retrieve a block

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a Notion block |

### Tool: **`API-retrieve-a-comment`**

Retrieve comments

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a Notion block or page |
| `page_size` | `integer` *optional* | The number of items from the full list desired in the response. Maximum: 100 |
| `start_cursor` | `string` *optional* | If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results. |

### Tool: **`API-retrieve-a-database`**

Retrieve a database

| Parameter | Type | Description |
| - | - | - |
| `database_id` | `string` | An identifier for the Notion database. |

### Tool: **`API-retrieve-a-page`**

Retrieve a page

| Parameter | Type | Description |
| - | - | - |
| `page_id` | `string` | Identifier for a Notion page |
| `filter_properties` | `string` *optional* | A list of page property value IDs associated with the page. Use this param to limit the response to a specific page property value or values. To retrieve multiple properties, specify each page property ID. For example: `?filter_properties=iAk8&filter_properties=b7dh`. |

### Tool: **`API-retrieve-a-page-property`**

Retrieve a page property item

| Parameter | Type | Description |
| - | - | - |
| `page_id` | `string` | Identifier for a Notion page |
| `property_id` | `string` | Identifier for a page [property](https://developers.notion.com/reference/page#all-property-values) |
| `page_size` | `integer` *optional* | For paginated properties. The max number of property item objects on a page. The default size is 100 |
| `start_cursor` | `string` *optional* | For paginated properties. |

### Tool: **`API-update-a-block`**

Update a block

| Parameter | Type | Description |
| - | - | - |
| `block_id` | `string` | Identifier for a Notion block |
| `archived` | `boolean` *optional* | Set to true to archive (delete) a block. Set to false to un-archive (restore) a block. |
| `type` | `object` *optional* | The [block object `type`](ref:block#block-object-keys) value with the properties to be updated. Currently only `text` (for supported block types) and `checked` (for `to_do` blocks) fields can be updated. |

### Tool: **`API-update-a-database`**

Update a database

| Parameter | Type | Description |
| - | - | - |
| `database_id` | `string` | identifier for a Notion database |
| `description` | `array` *optional* | An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the database that is displayed in the Notion UI. If omitted, then the database description remains unchanged. |
| `properties` | `object` *optional* | Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object). |
| `title` | `array` *optional* | An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the title of the database that is displayed in the Notion UI. If omitted, then the database title remains unchanged. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "notion": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "OPENAPI_MCP_HEADERS"
        "mcp/notion"
      ],
      "env": {
        "OPENAPI_MCP_HEADERS": "{"Authorization": "Bearer ntn_****", "Notion-Version": "2022-06-28" }"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/notion -f Dockerfile https://github.com/makenotion/notion-mcp-server.git#refs/pull/16/merge
```


# Notion MCP Server

Official Notion MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/notion](https://hub.docker.com/repository/docker/mcp/notion)
**Author**|[makenotion](https://github.com/makenotion)
**Repository**|https://github.com/makenotion/notion-mcp-server
**Dockerfile**|https://github.com/makenotion/notion-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/notion)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`API-create-a-comment`|Create comment|
`API-create-a-database`|Create a database|
`API-delete-a-block`|Delete a block|
`API-get-block-children`|Retrieve block children|
`API-get-self`|Retrieve your token's bot user|
`API-get-user`|Retrieve a user
Error Responses:
400: 400|
`API-get-users`|List all users
Error Responses:
400: 400|
`API-patch-block-children`|Append block children|
`API-patch-page`|Update page properties|
`API-post-database-query`|Query a database|
`API-post-page`|Create a page|
`API-post-search`|Search by title|
`API-retrieve-a-block`|Retrieve a block|
`API-retrieve-a-comment`|Retrieve comments|
`API-retrieve-a-database`|Retrieve a database|
`API-retrieve-a-page`|Retrieve a page|
`API-retrieve-a-page-property`|Retrieve a page property item|
`API-update-a-block`|Update a block|
`API-update-a-database`|Update a database|

---
## Tools Details

#### Tool: **`API-create-a-comment`**
Create comment
Parameters|Type|Description
-|-|-
`parent`|`object`|The page that contains the comment
`rich_text`|`array`|

---
#### Tool: **`API-create-a-database`**
Create a database
Parameters|Type|Description
-|-|-
`parent`|`object`|
`properties`|`object`|Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object).
`title`|`array` *optional*|

---
#### Tool: **`API-delete-a-block`**
Delete a block
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a Notion block

---
#### Tool: **`API-get-block-children`**
Retrieve block children
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a [block](ref:block)
`page_size`|`integer` *optional*|The number of items from the full list desired in the response. Maximum: 100
`start_cursor`|`string` *optional*|If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results.

---
#### Tool: **`API-get-self`**
Retrieve your token's bot user
#### Tool: **`API-get-user`**
Retrieve a user
Error Responses:
400: 400
Parameters|Type|Description
-|-|-
`user_id`|`string`|

---
#### Tool: **`API-get-users`**
List all users
Error Responses:
400: 400
Parameters|Type|Description
-|-|-
`page_size`|`integer` *optional*|The number of items from the full list desired in the response. Maximum: 100
`start_cursor`|`string` *optional*|If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results.

---
#### Tool: **`API-patch-block-children`**
Append block children
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a [block](ref:block). Also accepts a [page](ref:page) ID.
`children`|`array`|Child content to append to a container block as an array of [block objects](ref:block)
`after`|`string` *optional*|The ID of the existing block that the new block should be appended after.

---
#### Tool: **`API-patch-page`**
Update page properties
Parameters|Type|Description
-|-|-
`page_id`|`string`|The identifier for the Notion page to be updated.
`archived`|`boolean` *optional*|
`cover`|`object` *optional*|A cover image for the page. Only [external file objects](https://developers.notion.com/reference/file-object) are supported.
`icon`|`object` *optional*|A page icon for the page. Supported types are [external file object](https://developers.notion.com/reference/file-object) or [emoji object](https://developers.notion.com/reference/emoji-object).
`in_trash`|`boolean` *optional*|Set to true to delete a block. Set to false to restore a block.
`properties`|`object` *optional*|The property values to update for the page. The keys are the names or IDs of the property and the values are property values. If a page property ID is not included, then it is not changed.

---
#### Tool: **`API-post-database-query`**
Query a database
Parameters|Type|Description
-|-|-
`database_id`|`string`|Identifier for a Notion database.
`archived`|`boolean` *optional*|
`filter`|`object` *optional*|When supplied, limits which pages are returned based on the [filter conditions](ref:post-database-query-filter).
`filter_properties`|`array` *optional*|A list of page property value IDs associated with the database. Use this param to limit the response to a specific page property value or values for pages that meet the `filter` criteria.
`in_trash`|`boolean` *optional*|
`page_size`|`integer` *optional*|The number of items from the full list desired in the response. Maximum: 100
`sorts`|`array` *optional*|When supplied, orders the results based on the provided [sort criteria](ref:post-database-query-sort).
`start_cursor`|`string` *optional*|When supplied, returns a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results.

---
#### Tool: **`API-post-page`**
Create a page
Parameters|Type|Description
-|-|-
`parent`|`object`|
`properties`|`object`|
`children`|`array` *optional*|The content to be rendered on the new page, represented as an array of [block objects](https://developers.notion.com/reference/block).
`cover`|`string` *optional*|The cover image of the new page, represented as a [file object](https://developers.notion.com/reference/file-object).
`icon`|`string` *optional*|The icon of the new page. Either an [emoji object](https://developers.notion.com/reference/emoji-object) or an [external file object](https://developers.notion.com/reference/file-object)..

---
#### Tool: **`API-post-search`**
Search by title
Parameters|Type|Description
-|-|-
`filter`|`object` *optional*|A set of criteria, `value` and `property` keys, that limits the results to either only pages or only databases. Possible `value` values are `"page"` or `"database"`. The only supported `property` value is `"object"`.
`page_size`|`integer` *optional*|The number of items from the full list to include in the response. Maximum: `100`.
`query`|`string` *optional*|The text that the API compares page and database titles against.
`sort`|`object` *optional*|A set of criteria, `direction` and `timestamp` keys, that orders the results. The **only** supported timestamp value is `"last_edited_time"`. Supported `direction` values are `"ascending"` and `"descending"`. If `sort` is not provided, then the most recently edited results are returned first.
`start_cursor`|`string` *optional*|A `cursor` value returned in a previous response that If supplied, limits the response to results starting after the `cursor`. If not supplied, then the first page of results is returned. Refer to [pagination](https://developers.notion.com/reference/intro#pagination) for more details.

---
#### Tool: **`API-retrieve-a-block`**
Retrieve a block
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a Notion block

---
#### Tool: **`API-retrieve-a-comment`**
Retrieve comments
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a Notion block or page
`page_size`|`integer` *optional*|The number of items from the full list desired in the response. Maximum: 100
`start_cursor`|`string` *optional*|If supplied, this endpoint will return a page of results starting after the cursor provided. If not supplied, this endpoint will return the first page of results.

---
#### Tool: **`API-retrieve-a-database`**
Retrieve a database
Parameters|Type|Description
-|-|-
`database_id`|`string`|An identifier for the Notion database.

---
#### Tool: **`API-retrieve-a-page`**
Retrieve a page
Parameters|Type|Description
-|-|-
`page_id`|`string`|Identifier for a Notion page
`filter_properties`|`string` *optional*|A list of page property value IDs associated with the page. Use this param to limit the response to a specific page property value or values. To retrieve multiple properties, specify each page property ID. For example: `?filter_properties=iAk8&filter_properties=b7dh`.

---
#### Tool: **`API-retrieve-a-page-property`**
Retrieve a page property item
Parameters|Type|Description
-|-|-
`page_id`|`string`|Identifier for a Notion page
`property_id`|`string`|Identifier for a page [property](https://developers.notion.com/reference/page#all-property-values)
`page_size`|`integer` *optional*|For paginated properties. The max number of property item objects on a page. The default size is 100
`start_cursor`|`string` *optional*|For paginated properties.

---
#### Tool: **`API-update-a-block`**
Update a block
Parameters|Type|Description
-|-|-
`block_id`|`string`|Identifier for a Notion block
`archived`|`boolean` *optional*|Set to true to archive (delete) a block. Set to false to un-archive (restore) a block.
`type`|`object` *optional*|The [block object `type`](ref:block#block-object-keys) value with the properties to be updated. Currently only `text` (for supported block types) and `checked` (for `to_do` blocks) fields can be updated.

---
#### Tool: **`API-update-a-database`**
Update a database
Parameters|Type|Description
-|-|-
`database_id`|`string`|identifier for a Notion database
`description`|`array` *optional*|An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the database that is displayed in the Notion UI. If omitted, then the database description remains unchanged.
`properties`|`object` *optional*|Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object).
`title`|`array` *optional*|An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the title of the database that is displayed in the Notion UI. If omitted, then the database title remains unchanged.

---
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
        "-e",
        "INTERNAL_INTEGRATION_TOKEN",
        "mcp/notion"
      ],
      "env": {
        "INTERNAL_INTEGRATION_TOKEN": "ntn_****"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

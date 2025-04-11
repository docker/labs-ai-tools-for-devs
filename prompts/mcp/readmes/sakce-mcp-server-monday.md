# sakce-mcp-server-monday MCP Server

MCP Server to interact with Monday.com boards and items

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [sakce](https://github.com/sakce) |
| **Repository** | https://github.com/sakce/mcp-server-monday |
| **Dockerfile** | https://github.com/sakce/mcp-server-monday/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`monday-add-doc-block`**: Add a block to a document
 1. **`monday-archive-item`**: Archive an item from a Monday.com board
 1. **`monday-create-board`**: Create a new Monday.com board
 1. **`monday-create-board-group`**: Create a new group in a Monday.com board
 1. **`monday-create-doc`**: Create a new document in Monday.com
 1. **`monday-create-item`**: Create a new item in a Monday.com Board. Optionally, specify the parent Item ID to create a Sub-item.
 1. **`monday-create-update`**: Create an update (comment) on a Monday.com Item or Sub-item.
 1. **`monday-delete-item`**: Delete an item from a Monday.com board
 1. **`monday-get-board-columns`**: Get the Columns of a Monday.com Board.
 1. **`monday-get-board-groups`**: Get the Groups of a Monday.com Board.
 1. **`monday-get-doc-content`**: Get the content of a specific document by ID
 1. **`monday-get-docs`**: Get a list of documents from Monday.com, optionally filtered by folder
 1. **`monday-get-item-files`**: Get files (PDFs, documents, images, etc.) attached to a Monday.com item
 1. **`monday-get-item-updates`**: Get updates for a specific item in Monday.com
 1. **`monday-get-items-by-id`**: Fetch specific Monday.com item by its ID
 1. **`monday-get-update-files`**: Get files (PDFs, documents, images, etc.) attached to a specific update in Monday.com
 1. **`monday-list-boards`**: Get all Boards from Monday.com
 1. **`monday-list-items-in-groups`**: List all items in the specified groups of a Monday.com board
 1. **`monday-list-subitems-in-items`**: List all Sub-items of a list of Monday.com Items
 1. **`monday-move-item-to-group`**: Move an item to a group in a Monday.com board
 1. **`monday-update-item`**: Update a Monday.com item's or sub-item's column values.

## Tools

### Tool: **`monday-add-doc-block`**

Add a block to a document

| Parameter | Type | Description |
| - | - | - |
| `block_type` | `string` | Type of block to add (normal_text, bullet_list, numbered_list, heading, divider, etc.). |
| `content` | `string` | Content of the block to add. |
| `doc_id` | `string` | ID of the Monday.com document to add a block to. |
| `after_block_id` | `string` *optional* | Optional ID of the block to add this block after. |

### Tool: **`monday-archive-item`**

Archive an item from a Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` | Monday.com Item ID to archive. |

### Tool: **`monday-create-board`**

Create a new Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `board_name` | `string` | Name of the Monday.com board to create |
| `board_kind` | `string` *optional* | Kind of the Monday.com board to create (public, private, shareable). Default is public. |

### Tool: **`monday-create-board-group`**

Create a new group in a Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the group will be created in. |
| `groupName` | `string` | Name of the group to create. |

### Tool: **`monday-create-doc`**

Create a new document in Monday.com

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` | Content of the document to create. |
| `title` | `string` | Title of the document to create. |
| `folder_id` | `string` *optional* | Optional folder ID to create the document in. |

### Tool: **`monday-create-item`**

Create a new item in a Monday.com Board. Optionally, specify the parent Item ID to create a Sub-item.

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the Item or Sub-item is on. |
| `itemTitle` | `string` | Name of the Monday.com Item or Sub-item that will be created. |
| `columnValues` | `object` *optional* | Dictionary of column values to set {column_id: value} |
| `groupId` | `string` *optional* | Monday.com Board's Group ID to create the Item in. If set, parentItemId should not be set. |
| `parentItemId` | `string` *optional* | Monday.com Item ID to create the Sub-item under. If set, groupId should not be set. |

### Tool: **`monday-create-update`**

Create an update (comment) on a Monday.com Item or Sub-item.

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` |  |
| `updateText` | `string` | Content to update the Item or Sub-item with. |

### Tool: **`monday-delete-item`**

Delete an item from a Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` | Monday.com Item ID to delete. |

### Tool: **`monday-get-board-columns`**

Get the Columns of a Monday.com Board.

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the Item or Sub-item is on. |

### Tool: **`monday-get-board-groups`**

Get the Groups of a Monday.com Board.

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the Item or Sub-item is on. |

### Tool: **`monday-get-doc-content`**

Get the content of a specific document by ID

| Parameter | Type | Description |
| - | - | - |
| `doc_id` | `string` | ID of the Monday.com document to retrieve. |

### Tool: **`monday-get-docs`**

Get a list of documents from Monday.com, optionally filtered by folder

| Parameter | Type | Description |
| - | - | - |
| `folder_id` | `string` *optional* | Optional folder ID to filter documents by. |
| `limit` | `integer` *optional* | Maximum number of documents to retrieve. Default is 25. |

### Tool: **`monday-get-item-files`**

Get files (PDFs, documents, images, etc.) attached to a Monday.com item

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` | ID of the Monday.com item to get files from. |

### Tool: **`monday-get-item-updates`**

Get updates for a specific item in Monday.com

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` | ID of the Monday.com item to get updates for. |
| `limit` | `integer` *optional* | Maximum number of updates to retrieve. Default is 25. |

### Tool: **`monday-get-items-by-id`**

Fetch specific Monday.com item by its ID

| Parameter | Type | Description |
| - | - | - |
| `itemId` | `string` | ID of the Monday.com item to fetch. |

### Tool: **`monday-get-update-files`**

Get files (PDFs, documents, images, etc.) attached to a specific update in Monday.com

| Parameter | Type | Description |
| - | - | - |
| `updateId` | `string` | ID of the Monday.com update to get files from. |

### Tool: **`monday-list-boards`**

Get all Boards from Monday.com

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* | Maximum number of Monday.com Boards to return. |

### Tool: **`monday-list-items-in-groups`**

List all items in the specified groups of a Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the Item or Sub-item is on. |
| `groupIds` | `array` |  |
| `limit` | `integer` |  |
| `cursor` | `string` *optional* |  |

### Tool: **`monday-list-subitems-in-items`**

List all Sub-items of a list of Monday.com Items

| Parameter | Type | Description |
| - | - | - |
| `itemIds` | `array` |  |

### Tool: **`monday-move-item-to-group`**

Move an item to a group in a Monday.com board

| Parameter | Type | Description |
| - | - | - |
| `groupId` | `string` | Monday.com Group ID to move the Item to. |
| `itemId` | `string` | Monday.com Item ID to move. |

### Tool: **`monday-update-item`**

Update a Monday.com item's or sub-item's column values.

| Parameter | Type | Description |
| - | - | - |
| `boardId` | `string` | Monday.com Board ID that the Item or Sub-item is on. |
| `columnValues` | `object` | Dictionary of column values to update the Monday.com Item or Sub-item with. ({column_id: value}) |
| `itemId` | `string` | Monday.com Item or Sub-item ID to update the columns of. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "sakce-mcp-server-monday": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/sakce-mcp-server-monday"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/sakce-mcp-server-monday -f Dockerfile https://github.com/sakce/mcp-server-monday.git
```


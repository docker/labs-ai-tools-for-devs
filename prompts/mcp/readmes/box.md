# Box MCP Server

An MCP server capable of interacting with the Box API

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[box-community](https://github.com/box-community)
**Repository**|https://github.com/box-community/mcp-server-box
**Dockerfile**|https://github.com/box-community/mcp-server-box/blob/refs/pull/4/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/box)
**Licence**|

## Available Tools
Tools provided by this Server|Short Description
-|-
`box_ai_extract_data`|"
Extract data from a single file in Box using AI.|
`box_ask_ai_tool`|Ask box ai about a file in Box.|
`box_ask_ai_tool_multi_file`|Use Box AI to analyze and respond to a prompt based on the content of multiple files.|
`box_authorize_app_tool`|Authorize the Box application.|
`box_download_file_tool`|Download a file from Box and return its content as a string.|
`box_list_folder_content_by_folder_id`|List the content of a folder in Box by its ID.|
`box_manage_folder_tool`|Manage Box folders - create, delete, or update.|
`box_read_tool`|Read the text content of a file in Box.|
`box_search_folder_by_name`|Locate a folder in Box by its name.|
`box_search_tool`|Search for files in Box with the given query.|
`box_upload_file_tool`|Upload content as a file to Box.|
`box_who_am_i`|Get the current user's information.|

---
## Tools Details

#### Tool: **`box_ai_extract_data`**
"
Extract data from a single file in Box using AI.
Parameters|Type|Description
-|-|-
`fields`|`string`|
`file_id`|`string`|

---
#### Tool: **`box_ask_ai_tool`**
Ask box ai about a file in Box.
Parameters|Type|Description
-|-|-
`file_id`|`string`|
`prompt`|`string`|

---
#### Tool: **`box_ask_ai_tool_multi_file`**
Use Box AI to analyze and respond to a prompt based on the content of multiple files.

This tool allows users to query Box AI with a specific prompt, leveraging the content
of multiple files stored in Box. The AI processes the files and generates a response
based on the provided prompt.
Parameters|Type|Description
-|-|-
`file_ids`|`array`|
`prompt`|`string`|

---
#### Tool: **`box_authorize_app_tool`**
Authorize the Box application.
Start the Box app authorization process

return:
    str: Message
#### Tool: **`box_download_file_tool`**
Download a file from Box and return its content as a string.
Supports text files (returns content directly) and images (returns base64-encoded).
Other file types will return an error message.
Optionally saves the file locally.
Parameters|Type|Description
-|-|-
`file_id`|`string`|
`save_file`|`boolean` *optional*|
`save_path`|`string` *optional*|

---
#### Tool: **`box_list_folder_content_by_folder_id`**
List the content of a folder in Box by its ID.
Parameters|Type|Description
-|-|-
`folder_id`|`string`|
`is_recursive`|`string`|

---
#### Tool: **`box_manage_folder_tool`**
Manage Box folders - create, delete, or update.
Parameters|Type|Description
-|-|-
`action`|`string`|
`description`|`string` *optional*|
`folder_id`|`string` *optional*|
`name`|`string` *optional*|
`parent_id`|`string` *optional*|
`recursive`|`boolean` *optional*|

---
#### Tool: **`box_read_tool`**
Read the text content of a file in Box.
Parameters|Type|Description
-|-|-
`file_id`|`string`|

---
#### Tool: **`box_search_folder_by_name`**
Locate a folder in Box by its name.
Parameters|Type|Description
-|-|-
`folder_name`|`string`|

---
#### Tool: **`box_search_tool`**
Search for files in Box with the given query.
Parameters|Type|Description
-|-|-
`query`|`string`|
`ancestor_folder_ids`|`string` *optional*|
`file_extensions`|`string` *optional*|
`where_to_look_for_query`|`string` *optional*|

---
#### Tool: **`box_upload_file_tool`**
Upload content as a file to Box.
Parameters|Type|Description
-|-|-
`content`|`string`|
`file_name`|`string`|
`folder_id`|`string` *optional*|

---
#### Tool: **`box_who_am_i`**
Get the current user's information.
This is also useful to check the connection status.

return:
    str: The current user's information.
## Use this MCP Server

```json
{
  "mcpServers": {
    "box": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "BOX_CLIENT_ID",
        "-e",
        "BOX_CLIENT_SECRET",
        "mcp/box"
      ],
      "env": {
        "BOX_CLIENT_ID": "your_client_id",
        "BOX_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

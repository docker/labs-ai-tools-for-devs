# Line MCP Server

MCP server that integrates the LINE Messaging API to connect an AI Agent to the LINE Official Account.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[line](https://github.com/line)
**Repository**|https://github.com/line/line-bot-mcp-server
**Dockerfile**|https://github.com/line/line-bot-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/line)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`broadcast_flex_message`|Broadcast a highly customizable flex message via LINE to all users who have added your LINE Official Account.|
`broadcast_text_message`|Broadcast a simple text message via LINE to all users who have followed your LINE Official Account.|
`get_profile`|Get detailed profile information of a LINE user including display name, profile picture URL, status message and language.|
`push_flex_message`|Push a highly customizable flex message to a user via LINE.|
`push_text_message`|Push a simple text message to a user via LINE.|

---
## Tools Details

#### Tool: **`broadcast_flex_message`**
Broadcast a highly customizable flex message via LINE to all users who have added your LINE Official Account. Supports both bubble (single container) and carousel (multiple swipeable bubbles) layouts. Please be aware that this message will be sent to all users.
Parameters|Type|Description
-|-|-
`message`|`object`|

---
#### Tool: **`broadcast_text_message`**
Broadcast a simple text message via LINE to all users who have followed your LINE Official Account. Use this for sending plain text messages without formatting. Please be aware that this message will be sent to all users.
Parameters|Type|Description
-|-|-
`message`|`object`|

---
#### Tool: **`get_profile`**
Get detailed profile information of a LINE user including display name, profile picture URL, status message and language.
Parameters|Type|Description
-|-|-
`userId`|`string` *optional*|The user ID to receive a message. Defaults to DESTINATION_USER_ID.

---
#### Tool: **`push_flex_message`**
Push a highly customizable flex message to a user via LINE. Supports both bubble (single container) and carousel (multiple swipeable bubbles) layouts.
Parameters|Type|Description
-|-|-
`message`|`object`|
`userId`|`string` *optional*|The user ID to receive a message. Defaults to DESTINATION_USER_ID.

---
#### Tool: **`push_text_message`**
Push a simple text message to a user via LINE. Use this for sending plain text messages without formatting.
Parameters|Type|Description
-|-|-
`message`|`object`|
`userId`|`string` *optional*|The user ID to receive a message. Defaults to DESTINATION_USER_ID.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "line": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DESTINATION_USER_ID",
        "-e",
        "CHANNEL_ACCESS_TOKEN",
        "mcp/line"
      ],
      "env": {
        "DESTINATION_USER_ID": "FILL_HERE",
        "CHANNEL_ACCESS_TOKEN": "FILL_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

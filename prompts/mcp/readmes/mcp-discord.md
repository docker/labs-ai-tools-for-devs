# Discord MCP Server

Interact with the Discord platform.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/mcp-discord](https://hub.docker.com/repository/docker/mcp/mcp-discord)
**Author**|[slimslenderslacks](https://github.com/slimslenderslacks)
**Repository**|https://github.com/slimslenderslacks/mcp-discord
**Dockerfile**|https://github.com/slimslenderslacks/mcp-discord/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/mcp-discord)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/mcp-discord --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`discord_add_multiple_reactions`|Adds multiple emoji reactions to a Discord message at once|
`discord_add_reaction`|Adds an emoji reaction to a specific Discord message|
`discord_create_forum_post`|Creates a new post in a Discord forum channel with optional tags|
`discord_create_text_channel`|Creates a new text channel in a Discord server with an optional topic|
`discord_create_webhook`|Creates a new webhook for a Discord channel|
`discord_delete_channel`|Deletes a Discord channel with an optional reason|
`discord_delete_forum_post`|Deletes a forum post or thread with an optional reason|
`discord_delete_message`|Deletes a specific message from a Discord text channel|
`discord_delete_webhook`|Deletes an existing webhook for a Discord channel|
`discord_edit_webhook`|Edits an existing webhook for a Discord channel|
`discord_get_forum_channels`|Lists all forum channels in a specified Discord server (guild)|
`discord_get_forum_post`|Retrieves details about a forum post including its messages|
`discord_get_server_info`|Retrieves detailed information about a Discord server including channels and member count|
`discord_login`|Logs in to Discord using the configured token|
`discord_read_messages`|Retrieves messages from a Discord text channel with a configurable limit|
`discord_remove_reaction`|Removes a specific emoji reaction from a Discord message|
`discord_reply_to_forum`|Adds a reply to an existing forum post or thread|
`discord_send`|Sends a message to a specified Discord text channel|
`discord_send_webhook_message`|Sends a message to a Discord channel using a webhook|
`test`|A simple test tool to verify the MCP server is working correctly|

---
## Tools Details

#### Tool: **`discord_add_multiple_reactions`**
Adds multiple emoji reactions to a Discord message at once
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`emojis`|`array`|
`messageId`|`string`|

---
#### Tool: **`discord_add_reaction`**
Adds an emoji reaction to a specific Discord message
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`emoji`|`string`|
`messageId`|`string`|

---
#### Tool: **`discord_create_forum_post`**
Creates a new post in a Discord forum channel with optional tags
Parameters|Type|Description
-|-|-
`content`|`string`|
`forumChannelId`|`string`|
`title`|`string`|
`tags`|`array` *optional*|

---
#### Tool: **`discord_create_text_channel`**
Creates a new text channel in a Discord server with an optional topic
Parameters|Type|Description
-|-|-
`channelName`|`string`|
`guildId`|`string`|
`topic`|`string` *optional*|

---
#### Tool: **`discord_create_webhook`**
Creates a new webhook for a Discord channel
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`name`|`string`|
`avatar`|`string` *optional*|
`reason`|`string` *optional*|

---
#### Tool: **`discord_delete_channel`**
Deletes a Discord channel with an optional reason
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`reason`|`string` *optional*|

---
#### Tool: **`discord_delete_forum_post`**
Deletes a forum post or thread with an optional reason
Parameters|Type|Description
-|-|-
`threadId`|`string`|
`reason`|`string` *optional*|

---
#### Tool: **`discord_delete_message`**
Deletes a specific message from a Discord text channel
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`messageId`|`string`|
`reason`|`string` *optional*|

---
#### Tool: **`discord_delete_webhook`**
Deletes an existing webhook for a Discord channel
Parameters|Type|Description
-|-|-
`webhookId`|`string`|
`reason`|`string` *optional*|
`webhookToken`|`string` *optional*|

---
#### Tool: **`discord_edit_webhook`**
Edits an existing webhook for a Discord channel
Parameters|Type|Description
-|-|-
`webhookId`|`string`|
`avatar`|`string` *optional*|
`channelId`|`string` *optional*|
`name`|`string` *optional*|
`reason`|`string` *optional*|
`webhookToken`|`string` *optional*|

---
#### Tool: **`discord_get_forum_channels`**
Lists all forum channels in a specified Discord server (guild)
Parameters|Type|Description
-|-|-
`guildId`|`string`|

---
#### Tool: **`discord_get_forum_post`**
Retrieves details about a forum post including its messages
Parameters|Type|Description
-|-|-
`threadId`|`string`|

---
#### Tool: **`discord_get_server_info`**
Retrieves detailed information about a Discord server including channels and member count
Parameters|Type|Description
-|-|-
`guildId`|`string`|

---
#### Tool: **`discord_login`**
Logs in to Discord using the configured token
Parameters|Type|Description
-|-|-
`random_string`|`string` *optional*|

---
#### Tool: **`discord_read_messages`**
Retrieves messages from a Discord text channel with a configurable limit
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`limit`|`number` *optional*|

---
#### Tool: **`discord_remove_reaction`**
Removes a specific emoji reaction from a Discord message
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`emoji`|`string`|
`messageId`|`string`|
`userId`|`string` *optional*|

---
#### Tool: **`discord_reply_to_forum`**
Adds a reply to an existing forum post or thread
Parameters|Type|Description
-|-|-
`message`|`string`|
`threadId`|`string`|

---
#### Tool: **`discord_send`**
Sends a message to a specified Discord text channel
Parameters|Type|Description
-|-|-
`channelId`|`string`|
`message`|`string`|

---
#### Tool: **`discord_send_webhook_message`**
Sends a message to a Discord channel using a webhook
Parameters|Type|Description
-|-|-
`content`|`string`|
`webhookId`|`string`|
`webhookToken`|`string`|
`avatarURL`|`string` *optional*|
`threadId`|`string` *optional*|
`username`|`string` *optional*|

---
#### Tool: **`test`**
A simple test tool to verify the MCP server is working correctly
## Use this MCP Server

```json
{
  "mcpServers": {
    "mcp-discord": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DISCORD_TOKEN",
        "mcp/mcp-discord"
      ],
      "env": {
        "DISCORD_TOKEN": "YOUR_DISCORD_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

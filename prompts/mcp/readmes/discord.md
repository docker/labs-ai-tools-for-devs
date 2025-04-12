# discord MCP Server

Interact with the Discord platform.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [slimslenderslacks](https://github.com/slimslenderslacks) |
| **Repository** | https://github.com/slimslenderslacks/mcp-discord |
| **Dockerfile** | https://github.com/slimslenderslacks/mcp-discord/blob/slim/docker/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`discord_add_multiple_reactions`**: Adds multiple emoji reactions to a Discord message at once
 1. **`discord_add_reaction`**: Adds an emoji reaction to a specific Discord message
 1. **`discord_create_forum_post`**: Creates a new post in a Discord forum channel with optional tags
 1. **`discord_create_text_channel`**: Creates a new text channel in a Discord server with an optional topic
 1. **`discord_create_webhook`**: Creates a new webhook for a Discord channel
 1. **`discord_delete_channel`**: Deletes a Discord channel with an optional reason
 1. **`discord_delete_forum_post`**: Deletes a forum post or thread with an optional reason
 1. **`discord_delete_message`**: Deletes a specific message from a Discord text channel
 1. **`discord_delete_webhook`**: Deletes an existing webhook for a Discord channel
 1. **`discord_edit_webhook`**: Edits an existing webhook for a Discord channel
 1. **`discord_get_forum_channels`**: Lists all forum channels in a specified Discord server (guild)
 1. **`discord_get_forum_post`**: Retrieves details about a forum post including its messages
 1. **`discord_get_server_info`**: Retrieves detailed information about a Discord server including channels and member count
 1. **`discord_login`**: Logs in to Discord using the configured token
 1. **`discord_read_messages`**: Retrieves messages from a Discord text channel with a configurable limit
 1. **`discord_remove_reaction`**: Removes a specific emoji reaction from a Discord message
 1. **`discord_reply_to_forum`**: Adds a reply to an existing forum post or thread
 1. **`discord_send`**: Sends a message to a specified Discord text channel
 1. **`discord_send_webhook_message`**: Sends a message to a Discord channel using a webhook
 1. **`test`**: A simple test tool to verify the MCP server is working correctly

## Tools

### Tool: **`discord_add_multiple_reactions`**

Adds multiple emoji reactions to a Discord message at once

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `emojis` | `array` |  |
| `messageId` | `string` |  |

### Tool: **`discord_add_reaction`**

Adds an emoji reaction to a specific Discord message

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `emoji` | `string` |  |
| `messageId` | `string` |  |

### Tool: **`discord_create_forum_post`**

Creates a new post in a Discord forum channel with optional tags

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` |  |
| `forumChannelId` | `string` |  |
| `title` | `string` |  |
| `tags` | `array` *optional* |  |

### Tool: **`discord_create_text_channel`**

Creates a new text channel in a Discord server with an optional topic

| Parameter | Type | Description |
| - | - | - |
| `channelName` | `string` |  |
| `guildId` | `string` |  |
| `topic` | `string` *optional* |  |

### Tool: **`discord_create_webhook`**

Creates a new webhook for a Discord channel

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `name` | `string` |  |
| `avatar` | `string` *optional* |  |
| `reason` | `string` *optional* |  |

### Tool: **`discord_delete_channel`**

Deletes a Discord channel with an optional reason

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `reason` | `string` *optional* |  |

### Tool: **`discord_delete_forum_post`**

Deletes a forum post or thread with an optional reason

| Parameter | Type | Description |
| - | - | - |
| `threadId` | `string` |  |
| `reason` | `string` *optional* |  |

### Tool: **`discord_delete_message`**

Deletes a specific message from a Discord text channel

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `messageId` | `string` |  |
| `reason` | `string` *optional* |  |

### Tool: **`discord_delete_webhook`**

Deletes an existing webhook for a Discord channel

| Parameter | Type | Description |
| - | - | - |
| `webhookId` | `string` |  |
| `reason` | `string` *optional* |  |
| `webhookToken` | `string` *optional* |  |

### Tool: **`discord_edit_webhook`**

Edits an existing webhook for a Discord channel

| Parameter | Type | Description |
| - | - | - |
| `webhookId` | `string` |  |
| `avatar` | `string` *optional* |  |
| `channelId` | `string` *optional* |  |
| `name` | `string` *optional* |  |
| `reason` | `string` *optional* |  |
| `webhookToken` | `string` *optional* |  |

### Tool: **`discord_get_forum_channels`**

Lists all forum channels in a specified Discord server (guild)

| Parameter | Type | Description |
| - | - | - |
| `guildId` | `string` |  |

### Tool: **`discord_get_forum_post`**

Retrieves details about a forum post including its messages

| Parameter | Type | Description |
| - | - | - |
| `threadId` | `string` |  |

### Tool: **`discord_get_server_info`**

Retrieves detailed information about a Discord server including channels and member count

| Parameter | Type | Description |
| - | - | - |
| `guildId` | `string` |  |

### Tool: **`discord_login`**

Logs in to Discord using the configured token

| Parameter | Type | Description |
| - | - | - |
| `random_string` | `string` *optional* |  |

### Tool: **`discord_read_messages`**

Retrieves messages from a Discord text channel with a configurable limit

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `limit` | `number` *optional* |  |

### Tool: **`discord_remove_reaction`**

Removes a specific emoji reaction from a Discord message

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `emoji` | `string` |  |
| `messageId` | `string` |  |
| `userId` | `string` *optional* |  |

### Tool: **`discord_reply_to_forum`**

Adds a reply to an existing forum post or thread

| Parameter | Type | Description |
| - | - | - |
| `message` | `string` |  |
| `threadId` | `string` |  |

### Tool: **`discord_send`**

Sends a message to a specified Discord text channel

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `message` | `string` |  |

### Tool: **`discord_send_webhook_message`**

Sends a message to a Discord channel using a webhook

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` |  |
| `webhookId` | `string` |  |
| `webhookToken` | `string` |  |
| `avatarURL` | `string` *optional* |  |
| `threadId` | `string` *optional* |  |
| `username` | `string` *optional* |  |

### Tool: **`test`**

A simple test tool to verify the MCP server is working correctly

## Use this MCP Server

```json
{
  "mcpServers": {
    "discord": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "DISCORD_TOKEN"
        "mcp/discord"
      ],
      "env": {
        "DISCORD_TOKEN": "YOUR_DISCORD_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/discord -f Dockerfile https://github.com/slimslenderslacks/mcp-discord.git#slim/docker
```


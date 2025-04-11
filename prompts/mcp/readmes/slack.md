# slack MCP Server

Interact with Slack Workspaces over the Slack API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/slack/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`slack_add_reaction`**: Add a reaction emoji to a message
 1. **`slack_get_channel_history`**: Get recent messages from a channel
 1. **`slack_get_thread_replies`**: Get all replies in a message thread
 1. **`slack_get_user_profile`**: Get detailed profile information for a specific user
 1. **`slack_get_users`**: Get a list of all users in the workspace with their basic profile information
 1. **`slack_list_channels`**: List public channels in the workspace with pagination
 1. **`slack_post_message`**: Post a new message to a Slack channel
 1. **`slack_reply_to_thread`**: Reply to a specific message thread in Slack

## Tools

### Tool: **`slack_add_reaction`**

Add a reaction emoji to a message

| Parameter | Type | Description |
| - | - | - |
| `channel_id` | `string` | The ID of the channel containing the message |
| `reaction` | `string` | The name of the emoji reaction (without ::) |
| `timestamp` | `string` | The timestamp of the message to react to |

### Tool: **`slack_get_channel_history`**

Get recent messages from a channel

| Parameter | Type | Description |
| - | - | - |
| `channel_id` | `string` | The ID of the channel |
| `limit` | `number` *optional* | Number of messages to retrieve (default 10) |

### Tool: **`slack_get_thread_replies`**

Get all replies in a message thread

| Parameter | Type | Description |
| - | - | - |
| `channel_id` | `string` | The ID of the channel containing the thread |
| `thread_ts` | `string` | The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it. |

### Tool: **`slack_get_user_profile`**

Get detailed profile information for a specific user

| Parameter | Type | Description |
| - | - | - |
| `user_id` | `string` | The ID of the user |

### Tool: **`slack_get_users`**

Get a list of all users in the workspace with their basic profile information

| Parameter | Type | Description |
| - | - | - |
| `cursor` | `string` *optional* | Pagination cursor for next page of results |
| `limit` | `number` *optional* | Maximum number of users to return (default 100, max 200) |

### Tool: **`slack_list_channels`**

List public channels in the workspace with pagination

| Parameter | Type | Description |
| - | - | - |
| `cursor` | `string` *optional* | Pagination cursor for next page of results |
| `limit` | `number` *optional* | Maximum number of channels to return (default 100, max 200) |

### Tool: **`slack_post_message`**

Post a new message to a Slack channel

| Parameter | Type | Description |
| - | - | - |
| `channel_id` | `string` | The ID of the channel to post to |
| `text` | `string` | The message text to post |

### Tool: **`slack_reply_to_thread`**

Reply to a specific message thread in Slack

| Parameter | Type | Description |
| - | - | - |
| `channel_id` | `string` | The ID of the channel containing the thread |
| `text` | `string` | The reply text |
| `thread_ts` | `string` | The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "slack": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "SLACK_BOT_TOKEN"
        "-e"
        "SLACK_TEAM_ID"
        "mcp/slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/slack -f src/slack/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


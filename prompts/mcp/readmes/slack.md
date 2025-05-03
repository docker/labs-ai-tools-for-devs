# Slack (Reference) MCP Server

Interact with Slack Workspaces over the Slack API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/slack](https://hub.docker.com/repository/docker/mcp/slack)
**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.24/src/slack/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/slack)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/slack --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`slack_add_reaction`|Add a reaction emoji to a message|
`slack_get_channel_history`|Get recent messages from a channel|
`slack_get_thread_replies`|Get all replies in a message thread|
`slack_get_user_profile`|Get detailed profile information for a specific user|
`slack_get_users`|Get a list of all users in the workspace with their basic profile information|
`slack_list_channels`|List public or pre-defined channels in the workspace with pagination|
`slack_post_message`|Post a new message to a Slack channel|
`slack_reply_to_thread`|Reply to a specific message thread in Slack|

---
## Tools Details

#### Tool: **`slack_add_reaction`**
Add a reaction emoji to a message
Parameters|Type|Description
-|-|-
`channel_id`|`string`|The ID of the channel containing the message
`reaction`|`string`|The name of the emoji reaction (without ::)
`timestamp`|`string`|The timestamp of the message to react to

---
#### Tool: **`slack_get_channel_history`**
Get recent messages from a channel
Parameters|Type|Description
-|-|-
`channel_id`|`string`|The ID of the channel
`limit`|`number` *optional*|Number of messages to retrieve (default 10)

---
#### Tool: **`slack_get_thread_replies`**
Get all replies in a message thread
Parameters|Type|Description
-|-|-
`channel_id`|`string`|The ID of the channel containing the thread
`thread_ts`|`string`|The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it.

---
#### Tool: **`slack_get_user_profile`**
Get detailed profile information for a specific user
Parameters|Type|Description
-|-|-
`user_id`|`string`|The ID of the user

---
#### Tool: **`slack_get_users`**
Get a list of all users in the workspace with their basic profile information
Parameters|Type|Description
-|-|-
`cursor`|`string` *optional*|Pagination cursor for next page of results
`limit`|`number` *optional*|Maximum number of users to return (default 100, max 200)

---
#### Tool: **`slack_list_channels`**
List public or pre-defined channels in the workspace with pagination
Parameters|Type|Description
-|-|-
`cursor`|`string` *optional*|Pagination cursor for next page of results
`limit`|`number` *optional*|Maximum number of channels to return (default 100, max 200)

---
#### Tool: **`slack_post_message`**
Post a new message to a Slack channel
Parameters|Type|Description
-|-|-
`channel_id`|`string`|The ID of the channel to post to
`text`|`string`|The message text to post

---
#### Tool: **`slack_reply_to_thread`**
Reply to a specific message thread in Slack
Parameters|Type|Description
-|-|-
`channel_id`|`string`|The ID of the channel containing the thread
`text`|`string`|The reply text
`thread_ts`|`string`|The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it.

---
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
        "-e",
        "SLACK_TEAM_ID",
        "-e",
        "SLACK_CHANNEL_IDS",
        "-e",
        "SLACK_BOT_TOKEN",
        "mcp/slack"
      ],
      "env": {
        "SLACK_TEAM_ID": "T01234567",
        "SLACK_CHANNEL_IDS": "C01234567, C76543210",
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

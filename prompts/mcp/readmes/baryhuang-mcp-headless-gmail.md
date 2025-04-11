# baryhuang-mcp-headless-gmail MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [baryhuang](https://github.com/baryhuang) |
| **Repository** | https://github.com/baryhuang/mcp-headless-gmail |
| **Dockerfile** | https://github.com/baryhuang/mcp-headless-gmail/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`gmail_get_email_body_chunk`**: Get a 1k character chunk of an email body starting from the specified offset
 1. **`gmail_get_recent_emails`**: Get the most recent emails from Gmail (returns metadata, snippets, and first 1k chars of body)
 1. **`gmail_refresh_token`**: Refresh the access token using the refresh token and client credentials
 1. **`gmail_send_email`**: Send an email via Gmail

## Tools

### Tool: **`gmail_get_email_body_chunk`**

Get a 1k character chunk of an email body starting from the specified offset

| Parameter | Type | Description |
| - | - | - |
| `google_access_token` | `string` | Google OAuth2 access token |
| `message_id` | `string` *optional* | ID of the message to retrieve |
| `offset` | `integer` *optional* | Offset in characters to start from (default: 0) |
| `thread_id` | `string` *optional* | ID of the thread to retrieve (will get the first message if multiple exist) |

### Tool: **`gmail_get_recent_emails`**

Get the most recent emails from Gmail (returns metadata, snippets, and first 1k chars of body)

| Parameter | Type | Description |
| - | - | - |
| `google_access_token` | `string` | Google OAuth2 access token |
| `max_results` | `integer` *optional* | Maximum number of emails to return (default: 10) |
| `unread_only` | `boolean` *optional* | Whether to return only unread emails (default: False) |

### Tool: **`gmail_refresh_token`**

Refresh the access token using the refresh token and client credentials

| Parameter | Type | Description |
| - | - | - |
| `google_client_id` | `string` | Google OAuth2 client ID for token refresh |
| `google_client_secret` | `string` | Google OAuth2 client secret for token refresh |
| `google_refresh_token` | `string` | Google OAuth2 refresh token |
| `google_access_token` | `string` *optional* | Google OAuth2 access token (optional if expired) |

### Tool: **`gmail_send_email`**

Send an email via Gmail

| Parameter | Type | Description |
| - | - | - |
| `body` | `string` | Email body content (plain text) |
| `google_access_token` | `string` | Google OAuth2 access token |
| `subject` | `string` | Email subject |
| `to` | `string` | Recipient email address |
| `html_body` | `string` *optional* | Email body content in HTML format (optional) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "baryhuang-mcp-headless-gmail": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/baryhuang-mcp-headless-gmail"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/baryhuang-mcp-headless-gmail -f Dockerfile https://github.com/baryhuang/mcp-headless-gmail.git
```


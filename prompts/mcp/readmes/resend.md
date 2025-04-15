# resend MCP Server

Send emails directly from Cursor with this email sending MCP server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[slimslenderslacks](https://github.com/slimslenderslacks)
**Repository**|https://github.com/slimslenderslacks/mcp-send-email
**Dockerfile**|https://github.com/slimslenderslacks/mcp-send-email/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|

## Summary
1. `send-email` Send an email using Resend

## Tools

### Tool `send-email`
Send an email using Resend

Parameter|Type|Description
-|-|-
`subject`|`string`|Email subject line
`text`|`string`|Plain text email content
`to`|`string`|Recipient email address
`bcc`|`array` *optional*|Optional array of BCC email addresses. You MUST ask the user for this parameter. Under no circumstance provide it yourself
`cc`|`array` *optional*|Optional array of CC email addresses. You MUST ask the user for this parameter. Under no circumstance provide it yourself
`html`|`string` *optional*|HTML email content. When provided, the plain text argument MUST be provided as well.
`scheduledAt`|`string` *optional*|Optional parameter to schedule the email. This uses natural language. Examples would be 'tomorrow at 10am' or 'in 2 hours' or 'next day at 9am PST' or 'Friday at 3pm ET'.

## Use this MCP Server

```json
{
  "mcpServers": {
    "resend": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "REPLY_TO_EMAIL_ADDRESSES",
        "-e",
        "SENDER_EMAIL_ADDRESS",
        "-e",
        "RESEND_API_KEY",
        "mcp/resend"
      ],
      "env": {
        "REPLY_TO_EMAIL_ADDRESSES": "YOUR_REPLY_TO_EMAIL_ADDRESSES",
        "SENDER_EMAIL_ADDRESS": "YOUR_SENDER_EMAIL_ADDRESS",
        "RESEND_API_KEY": "YOUR_RESEND_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

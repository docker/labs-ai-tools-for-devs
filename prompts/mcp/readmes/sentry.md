# sentry MCP Server

A Model Context Protocol server for retrieving and analyzing issues from Sentry.io. This server provides tools to inspect error reports, stacktraces, and other debugging information from your Sentry account.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`get_sentry_issue`**: Retrieve and analyze a Sentry issue by ID or URL. Use this tool when you need to:
                - Investigate production errors and crashes
                - Access detailed stacktraces from Sentry
                - Analyze error patterns and frequencies
                - Get information about when issues first/last occurred
                - Review error counts and status

## Tools

### Tool: **`get_sentry_issue`**

Retrieve and analyze a Sentry issue by ID or URL. Use this tool when you need to:
                - Investigate production errors and crashes
                - Access detailed stacktraces from Sentry
                - Analyze error patterns and frequencies
                - Get information about when issues first/last occurred
                - Review error counts and status

| Parameter | Type | Description |
| - | - | - |
| `issue_id_or_url` | `string` | Sentry issue ID or URL to analyze |

## Use this MCP Server

```json
{
  "mcpServers": {
    "sentry": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "SENTRY_AUTH_TOKEN"
        "mcp/sentry"
      ],
      "env": {
        "SENTRY_AUTH_TOKEN": "YOUR_SENTRY_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/sentry -f Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6:src/sentry
```


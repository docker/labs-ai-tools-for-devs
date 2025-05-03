# Time (Reference) MCP Server

Time and timezone conversion capabilities.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/time](https://hub.docker.com/repository/docker/mcp/time)
**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/time/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/time)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/time --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`convert_time`|Convert time between timezones|
`get_current_time`|Get current time in a specific timezones|

---
## Tools Details

#### Tool: **`convert_time`**
Convert time between timezones
Parameters|Type|Description
-|-|-
`source_timezone`|`string`|Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no source timezone provided by the user.
`target_timezone`|`string`|Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'UTC' as local timezone if no target timezone provided by the user.
`time`|`string`|Time to convert in 24-hour format (HH:MM)

---
#### Tool: **`get_current_time`**
Get current time in a specific timezones
Parameters|Type|Description
-|-|-
`timezone`|`string`|IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no timezone provided by the user.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "time": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/time"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

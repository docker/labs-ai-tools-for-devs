# time MCP Server

Time and timezone conversion capabilities

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Summary
1. `convert_time` Convert time between timezones
1. `get_current_time` Get current time in a specific timezones

## Tools

### Tool `convert_time`
Convert time between timezones

Parameter|Type|Description
-|-|-
`source_timezone`|`string`|Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no source timezone provided by the user.
`target_timezone`|`string`|Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'UTC' as local timezone if no target timezone provided by the user.
`time`|`string`|Time to convert in 24-hour format (HH:MM)

### Tool `get_current_time`
Get current time in a specific timezones

Parameter|Type|Description
-|-|-
`timezone`|`string`|IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no timezone provided by the user.

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

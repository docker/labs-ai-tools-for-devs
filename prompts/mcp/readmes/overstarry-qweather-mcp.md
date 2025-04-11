# overstarry-qweather-mcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [overstarry](https://github.com/overstarry) |
| **Repository** | https://github.com/overstarry/qweather-mcp |
| **Dockerfile** | https://github.com/overstarry/qweather-mcp/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`get-weather-now`**: Get current weather for a location using QWeather API
 1. **`lookup-city`**: Look up city information by name

## Tools

### Tool: **`get-weather-now`**

Get current weather for a location using QWeather API

| Parameter | Type | Description |
| - | - | - |
| `location` | `string` | Location ID for the city |

### Tool: **`lookup-city`**

Look up city information by name

| Parameter | Type | Description |
| - | - | - |
| `cityName` | `string` | Name of the city to look up |

## Use this MCP Server

```json
{
  "mcpServers": {
    "overstarry-qweather-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "QWEATHER_API_BASE"
        "-e"
        "QWEATHER_API_KEY"
        "mcpcommunity/overstarry-qweather-mcp"
      ],
      "env": {
        "QWEATHER_API_BASE": "YOUR_QWEATHER_API_BASE",
        "QWEATHER_API_KEY": "YOUR_QWEATHER_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/overstarry-qweather-mcp -f Dockerfile https://github.com/overstarry/qweather-mcp.git#master
```


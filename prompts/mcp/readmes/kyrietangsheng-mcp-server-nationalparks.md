# kyrietangsheng-mcp-server-nationalparks MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [KyrieTangSheng](https://github.com/KyrieTangSheng) |
| **Repository** | https://github.com/KyrieTangSheng/mcp-server-nationalparks |
| **Dockerfile** | https://github.com/KyrieTangSheng/mcp-server-nationalparks/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`findParks`**: Search for national parks based on state, name, activities, or other criteria
 1. **`getAlerts`**: Get current alerts for national parks including closures, hazards, and important information
 1. **`getCampgrounds`**: Get information about available campgrounds and their amenities
 1. **`getEvents`**: Find upcoming events at parks
 1. **`getParkDetails`**: Get detailed information about a specific national park
 1. **`getVisitorCenters`**: Get information about visitor centers and their operating hours

## Tools

### Tool: **`findParks`**

Search for national parks based on state, name, activities, or other criteria

| Parameter | Type | Description |
| - | - | - |
| `activities` | `string` *optional* | Filter by available activities (e.g., "hiking,camping") |
| `limit` | `number` *optional* | Maximum number of parks to return (default: 10, max: 50) |
| `q` | `string` *optional* | Search term to filter parks by name or description |
| `start` | `number` *optional* | Start position for results (useful for pagination) |
| `stateCode` | `string` *optional* | Filter parks by state code (e.g., "CA" for California, "NY" for New York). Multiple states can be comma-separated (e.g., "CA,OR,WA") |

### Tool: **`getAlerts`**

Get current alerts for national parks including closures, hazards, and important information

| Parameter | Type | Description |
| - | - | - |
| `limit` | `number` *optional* | Maximum number of alerts to return (default: 10, max: 50) |
| `parkCode` | `string` *optional* | Filter alerts by park code (e.g., "yose" for Yosemite). Multiple parks can be comma-separated (e.g., "yose,grca"). |
| `q` | `string` *optional* | Search term to filter alerts by title or description |
| `start` | `number` *optional* | Start position for results (useful for pagination) |

### Tool: **`getCampgrounds`**

Get information about available campgrounds and their amenities

| Parameter | Type | Description |
| - | - | - |
| `limit` | `number` *optional* | Maximum number of campgrounds to return (default: 10, max: 50) |
| `parkCode` | `string` *optional* | Filter campgrounds by park code (e.g., "yose" for Yosemite). Multiple parks can be comma-separated (e.g., "yose,grca"). |
| `q` | `string` *optional* | Search term to filter campgrounds by name or description |
| `start` | `number` *optional* | Start position for results (useful for pagination) |

### Tool: **`getEvents`**

Find upcoming events at parks

| Parameter | Type | Description |
| - | - | - |
| `dateEnd` | `string` *optional* | End date for filtering events (format: YYYY-MM-DD) |
| `dateStart` | `string` *optional* | Start date for filtering events (format: YYYY-MM-DD) |
| `limit` | `number` *optional* | Maximum number of events to return (default: 10, max: 50) |
| `parkCode` | `string` *optional* | Filter events by park code (e.g., "yose" for Yosemite). Multiple parks can be comma-separated (e.g., "yose,grca"). |
| `q` | `string` *optional* | Search term to filter events by title or description |
| `start` | `number` *optional* | Start position for results (useful for pagination) |

### Tool: **`getParkDetails`**

Get detailed information about a specific national park

| Parameter | Type | Description |
| - | - | - |
| `parkCode` | `string` | The park code of the national park (e.g., "yose" for Yosemite, "grca" for Grand Canyon) |

### Tool: **`getVisitorCenters`**

Get information about visitor centers and their operating hours

| Parameter | Type | Description |
| - | - | - |
| `limit` | `number` *optional* | Maximum number of visitor centers to return (default: 10, max: 50) |
| `parkCode` | `string` *optional* | Filter visitor centers by park code (e.g., "yose" for Yosemite). Multiple parks can be comma-separated (e.g., "yose,grca"). |
| `q` | `string` *optional* | Search term to filter visitor centers by name or description |
| `start` | `number` *optional* | Start position for results (useful for pagination) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "kyrietangsheng-mcp-server-nationalparks": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/kyrietangsheng-mcp-server-nationalparks"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/kyrietangsheng-mcp-server-nationalparks -f Dockerfile https://github.com/KyrieTangSheng/mcp-server-nationalparks.git
```


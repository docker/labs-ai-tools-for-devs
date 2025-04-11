# openbnb-org-mcp-server-airbnb MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [openbnb-org](https://github.com/openbnb-org) |
| **Repository** | https://github.com/openbnb-org/mcp-server-airbnb |
| **Dockerfile** | https://github.com/openbnb-org/mcp-server-airbnb/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`airbnb_listing_details`**: Get detailed information about a specific Airbnb listing. Provide direct links to the user
 1. **`airbnb_search`**: Search for Airbnb listings with various filters and pagination. Provide direct links to the user

## Tools

### Tool: **`airbnb_listing_details`**

Get detailed information about a specific Airbnb listing. Provide direct links to the user

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The Airbnb listing ID |
| `adults` | `number` *optional* | Number of adults |
| `checkin` | `string` *optional* | Check-in date (YYYY-MM-DD) |
| `checkout` | `string` *optional* | Check-out date (YYYY-MM-DD) |
| `children` | `number` *optional* | Number of children |
| `ignoreRobotsText` | `boolean` *optional* | Ignore robots.txt rules for this request |
| `infants` | `number` *optional* | Number of infants |
| `pets` | `number` *optional* | Number of pets |

### Tool: **`airbnb_search`**

Search for Airbnb listings with various filters and pagination. Provide direct links to the user

| Parameter | Type | Description |
| - | - | - |
| `location` | `string` | Location to search for (city, state, etc.) |
| `adults` | `number` *optional* | Number of adults |
| `checkin` | `string` *optional* | Check-in date (YYYY-MM-DD) |
| `checkout` | `string` *optional* | Check-out date (YYYY-MM-DD) |
| `children` | `number` *optional* | Number of children |
| `cursor` | `string` *optional* | Base64-encoded string used for Pagination |
| `ignoreRobotsText` | `boolean` *optional* | Ignore robots.txt rules for this request |
| `infants` | `number` *optional* | Number of infants |
| `maxPrice` | `number` *optional* | Maximum price for the stay |
| `minPrice` | `number` *optional* | Minimum price for the stay |
| `pets` | `number` *optional* | Number of pets |
| `placeId` | `string` *optional* | Google Maps Place ID (overrides the location parameter) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "openbnb-org-mcp-server-airbnb": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/openbnb-org-mcp-server-airbnb"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/openbnb-org-mcp-server-airbnb -f Dockerfile https://github.com/openbnb-org/mcp-server-airbnb.git
```


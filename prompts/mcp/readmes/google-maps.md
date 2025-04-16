# Google-maps MCP Server

Tools for interacting with the Google Maps API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/google-maps/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/google-maps)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`maps_directions`|Get directions between two points|
`maps_distance_matrix`|Calculate travel distance and time for multiple origins and destinations|
`maps_elevation`|Get elevation data for locations on the earth|
`maps_geocode`|Convert an address into geographic coordinates|
`maps_place_details`|Get detailed information about a specific place|
`maps_reverse_geocode`|Convert coordinates into an address|
`maps_search_places`|Search for places using Google Places API|

---
## Tools Details

#### Tool: **`maps_directions`**
Get directions between two points
Parameters|Type|Description
-|-|-
`destination`|`string`|Ending point address or coordinates
`origin`|`string`|Starting point address or coordinates
`mode`|`string` *optional*|Travel mode (driving, walking, bicycling, transit)

---
#### Tool: **`maps_distance_matrix`**
Calculate travel distance and time for multiple origins and destinations
Parameters|Type|Description
-|-|-
`destinations`|`array`|Array of destination addresses or coordinates
`origins`|`array`|Array of origin addresses or coordinates
`mode`|`string` *optional*|Travel mode (driving, walking, bicycling, transit)

---
#### Tool: **`maps_elevation`**
Get elevation data for locations on the earth
Parameters|Type|Description
-|-|-
`locations`|`array`|Array of locations to get elevation for

---
#### Tool: **`maps_geocode`**
Convert an address into geographic coordinates
Parameters|Type|Description
-|-|-
`address`|`string`|The address to geocode

---
#### Tool: **`maps_place_details`**
Get detailed information about a specific place
Parameters|Type|Description
-|-|-
`place_id`|`string`|The place ID to get details for

---
#### Tool: **`maps_reverse_geocode`**
Convert coordinates into an address
Parameters|Type|Description
-|-|-
`latitude`|`number`|Latitude coordinate
`longitude`|`number`|Longitude coordinate

---
#### Tool: **`maps_search_places`**
Search for places using Google Places API
Parameters|Type|Description
-|-|-
`query`|`string`|Search query
`location`|`object` *optional*|Optional center point for the search
`radius`|`number` *optional*|Search radius in meters (max 50000)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "google-maps": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GOOGLE_MAPS_API_KEY",
        "mcp/google-maps"
      ],
      "env": {
        "GOOGLE_MAPS_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

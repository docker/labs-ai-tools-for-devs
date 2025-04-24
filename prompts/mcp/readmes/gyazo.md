# Gyazo MCP Server

Official Model Context Protocol server for Gyazo.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/gyazo](https://hub.docker.com/repository/docker/mcp/gyazo)
**Author**|[nota](https://github.com/nota)
**Repository**|https://github.com/nota/gyazo-mcp-server
**Dockerfile**|https://github.com/nota/gyazo-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/gyazo)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`gyazo_image`|Fetch image content and metadata from Gyazo|
`gyazo_latest_image`|Fetch latest uploaded image content and metadata from Gyazo|
`gyazo_search`|Full-text search for captures uploaded by users on Gyazo|
`gyazo_upload`|Upload an image to Gyazo|

---
## Tools Details

#### Tool: **`gyazo_image`**
Fetch image content and metadata from Gyazo
Parameters|Type|Description
-|-|-
`id_or_url`|`string`|ID or URL of the image on Gyazo

---
#### Tool: **`gyazo_latest_image`**
Fetch latest uploaded image content and metadata from Gyazo
Parameters|Type|Description
-|-|-
`name`|`string`|

---
#### Tool: **`gyazo_search`**
Full-text search for captures uploaded by users on Gyazo
Parameters|Type|Description
-|-|-
`query`|`string`|Search keyword (max length: 200 characters). example: 'cat', 'title:cat', 'app:"Google Chrome"', 'url:google.com', 'cat since:2024-01-01 until:2024-12-31' NOTE: If you cannot find an appropriate capture, try rephrasing the search query to capture the user's intent and repeat the search several times
`page`|`integer` *optional*|Page number for pagination
`per`|`integer` *optional*|Number of results per page (max: 100)

---
#### Tool: **`gyazo_upload`**
Upload an image to Gyazo
Parameters|Type|Description
-|-|-
`imageData`|`string`|Base64 encoded image data
`app`|`string` *optional*|Application name for the image (optional).
`description`|`string` *optional*|Description for the image (optional)
`refererUrl`|`string` *optional*|Source URL for the image (optional).
`title`|`string` *optional*|Title for the image (optional)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "gyazo": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GYAZO_ACCESS_TOKEN",
        "mcp/gyazo"
      ],
      "env": {
        "GYAZO_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

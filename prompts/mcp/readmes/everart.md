# EverArt MCP Server

Image generation server using EverArt's API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/everart](https://hub.docker.com/repository/docker/mcp/everart)
**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/everart/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/everart)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`generate_image`|Generate images using EverArt Models and returns a clickable link to view the generated image.|

---
## Tools Details

#### Tool: **`generate_image`**
Generate images using EverArt Models and returns a clickable link to view the generated image. The tool will return a URL that can be clicked to view the image in a browser. Available models:
- 5000:FLUX1.1: Standard quality
- 9000:FLUX1.1-ultra: Ultra high quality
- 6000:SD3.5: Stable Diffusion 3.5
- 7000:Recraft-Real: Photorealistic style
- 8000:Recraft-Vector: Vector art style

The response will contain a direct link to view the generated image.
Parameters|Type|Description
-|-|-
`prompt`|`string`|Text description of desired image
`image_count`|`number` *optional*|Number of images to generate
`model`|`string` *optional*|Model ID (5000:FLUX1.1, 9000:FLUX1.1-ultra, 6000:SD3.5, 7000:Recraft-Real, 8000:Recraft-Vector)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "everart": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "EVERART_API_KEY",
        "mcp/everart"
      ],
      "env": {
        "EVERART_API_KEY": "your_key_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

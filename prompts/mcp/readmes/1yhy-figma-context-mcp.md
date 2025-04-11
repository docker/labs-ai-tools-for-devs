# 1yhy-figma-context-mcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [1yhy](https://github.com/1yhy) |
| **Repository** | https://github.com/1yhy/Figma-Context-MCP |
| **Dockerfile** | https://github.com/1yhy/Figma-Context-MCP/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`download_figma_images`**: Download SVG and PNG images used in a Figma file based on the IDs of image or icon nodes
 1. **`get_figma_data`**: When the nodeId cannot be obtained, obtain the layout information about the entire Figma file

## Tools

### Tool: **`download_figma_images`**

Download SVG and PNG images used in a Figma file based on the IDs of image or icon nodes

| Parameter | Type | Description |
| - | - | - |
| `fileKey` | `string` | The key of the Figma file containing the node |
| `localPath` | `string` | The absolute path to the directory where images are stored in the project. Automatically creates directories if needed. |
| `nodes` | `array` | The nodes to fetch as images |

### Tool: **`get_figma_data`**

When the nodeId cannot be obtained, obtain the layout information about the entire Figma file

| Parameter | Type | Description |
| - | - | - |
| `fileKey` | `string` | The key of the Figma file to fetch, often found in a provided URL like figma.com/(file|design)/<fileKey>/... |
| `depth` | `number` *optional* | How many levels deep to traverse the node tree, only use if explicitly requested by the user |
| `nodeId` | `string` *optional* | The ID of the node to fetch, often found as URL parameter node-id=<nodeId>, always use if provided |

## Use this MCP Server

```json
{
  "mcpServers": {
    "1yhy-figma-context-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "FIGMA_API_KEY"
        "mcpcommunity/1yhy-figma-context-mcp"
      ],
      "env": {
        "FIGMA_API_KEY": "YOUR_FIGMA_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/1yhy-figma-context-mcp -f Dockerfile https://github.com/1yhy/Figma-Context-MCP.git
```


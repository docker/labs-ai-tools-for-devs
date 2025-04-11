# adityak74-mcp-scholarly MCP Server

A MCP server to search for accurate academic articles.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [adityak74](https://github.com/adityak74) |
| **Repository** | https://github.com/adityak74/mcp-scholarly |
| **Dockerfile** | https://github.com/adityak74/mcp-scholarly/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`search-arxiv`**: Search arxiv for articles related to the given keyword.
 1. **`search-google-scholar`**: Search google scholar for articles related to the given keyword.

## Tools

### Tool: **`search-arxiv`**

Search arxiv for articles related to the given keyword.

| Parameter | Type | Description |
| - | - | - |
| `keyword` | `string` |  |

### Tool: **`search-google-scholar`**

Search google scholar for articles related to the given keyword.

| Parameter | Type | Description |
| - | - | - |
| `keyword` | `string` |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "adityak74-mcp-scholarly": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/adityak74-mcp-scholarly"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/adityak74-mcp-scholarly -f Dockerfile https://github.com/adityak74/mcp-scholarly.git
```


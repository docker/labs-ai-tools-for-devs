# xgenerationlab-xiyan_mcp_server MCP Server

A Model Context Protocol (MCP) server that enables natural language queries to databases

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [XGenerationLab](https://github.com/XGenerationLab) |
| **Repository** | https://github.com/XGenerationLab/xiyan_mcp_server |
| **Dockerfile** | https://github.com/XGenerationLab/xiyan_mcp_server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`get_data`**: Fetch the data from database through a natural language query

## Tools

### Tool: **`get_data`**

Fetch the data from database through a natural language query

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The query in natual language |

## Use this MCP Server

```json
{
  "mcpServers": {
    "xgenerationlab-xiyan_mcp_server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/xgenerationlab-xiyan_mcp_server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/xgenerationlab-xiyan_mcp_server -f Dockerfile https://github.com/XGenerationLab/xiyan_mcp_server.git
```


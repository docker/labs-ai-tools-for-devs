# gongrzhe-quickchart-mcp-server MCP Server

A Model Context Protocol server for generating charts using QuickChart.io  . It allows you to create various types of charts through MCP tools.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [GongRzhe](https://github.com/GongRzhe) |
| **Repository** | https://github.com/GongRzhe/Quickchart-MCP-Server |
| **Dockerfile** | https://github.com/GongRzhe/Quickchart-MCP-Server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`download_chart`**: Download a chart image to a local file
 1. **`generate_chart`**: Generate a chart using QuickChart

## Tools

### Tool: **`download_chart`**

Download a chart image to a local file

| Parameter | Type | Description |
| - | - | - |
| `config` | `object` | Chart configuration object |
| `outputPath` | `string` | Path where the chart image should be saved |

### Tool: **`generate_chart`**

Generate a chart using QuickChart

| Parameter | Type | Description |
| - | - | - |
| `datasets` | `array` |  |
| `type` | `string` | Chart type (bar, line, pie, doughnut, radar, polarArea, scatter, bubble, radialGauge, speedometer) |
| `labels` | `array` *optional* | Labels for data points |
| `options` | `object` *optional* |  |
| `title` | `string` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "gongrzhe-quickchart-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/gongrzhe-quickchart-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/gongrzhe-quickchart-mcp-server -f Dockerfile https://github.com/GongRzhe/Quickchart-MCP-Server.git
```


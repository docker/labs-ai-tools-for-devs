# aarora79-aws-cost-explorer-mcp-server MCP Server

MCP server for understanding AWS spend

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [aarora79](https://github.com/aarora79) |
| **Repository** | https://github.com/aarora79/aws-cost-explorer-mcp-server |
| **Dockerfile** | https://github.com/aarora79/aws-cost-explorer-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`get_bedrock_daily_usage_stats`**: Get daily usage statistics with detailed breakdowns.
 1. **`get_bedrock_hourly_usage_stats`**: Get hourly usage statistics with detailed breakdowns.
 1. **`get_detailed_breakdown_by_day`**: Retrieve daily spend breakdown by region, service, and instance type.
 1. **`get_ec2_spend_last_day`**: Retrieve EC2 spend for the last day using standard AWS Cost Explorer API.

## Tools

### Tool: **`get_bedrock_daily_usage_stats`**

Get daily usage statistics with detailed breakdowns.

| Parameter | Type | Description |
| - | - | - |
| `params` | `string` | Parameters specifying the number of days to look back and region |

### Tool: **`get_bedrock_hourly_usage_stats`**

Get hourly usage statistics with detailed breakdowns.

| Parameter | Type | Description |
| - | - | - |
| `params` | `string` | Parameters specifying the number of days to look back and region |

### Tool: **`get_detailed_breakdown_by_day`**

Retrieve daily spend breakdown by region, service, and instance type.

| Parameter | Type | Description |
| - | - | - |
| `params` | `string` | Parameters specifying the number of days to look back |

### Tool: **`get_ec2_spend_last_day`**

Retrieve EC2 spend for the last day using standard AWS Cost Explorer API.

    Returns:
        Dict[str, Any]: The raw response from the AWS Cost Explorer API, or None if an error occurs.

## Use this MCP Server

```json
{
  "mcpServers": {
    "aarora79-aws-cost-explorer-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/aarora79-aws-cost-explorer-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/aarora79-aws-cost-explorer-mcp-server -f Dockerfile https://github.com/aarora79/aws-cost-explorer-mcp-server.git
```


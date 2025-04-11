# aws-kb-retrieval-server MCP Server

An MCP server implementation for retrieving information from the AWS Knowledge Base using the Bedrock Agent Runtime.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/aws-kb-retrieval-server/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`retrieve_from_aws_kb`**: Performs retrieval from the AWS Knowledge Base using the provided query and Knowledge Base ID.

## Tools

### Tool: **`retrieve_from_aws_kb`**

Performs retrieval from the AWS Knowledge Base using the provided query and Knowledge Base ID.

| Parameter | Type | Description |
| - | - | - |
| `knowledgeBaseId` | `string` | The ID of the AWS Knowledge Base |
| `query` | `string` | The query to perform retrieval on |
| `n` | `number` *optional* | Number of results to retrieve |

## Use this MCP Server

```json
{
  "mcpServers": {
    "aws-kb-retrieval-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "AWS_ACCESS_KEY_ID"
        "-e"
        "AWS_SECRET_ACCESS_KEY"
        "-e"
        "AWS_REGION"
        "mcp/aws-kb-retrieval-server"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "YOUR_ACCESS_KEY_HERE",
        "AWS_SECRET_ACCESS_KEY": "YOUR_SECRET_ACCESS_KEY_HERE",
        "AWS_REGION": "YOUR_AWS_REGION_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/aws-kb-retrieval-server -f src/aws-kb-retrieval-server/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


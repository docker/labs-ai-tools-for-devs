# baryhuang-mcp-server-aws-resources-python MCP Server

A Python-based MCP server that lets Claude run boto3 code to query and manage AWS resources. Execute powerful AWS operations directly through Claude with proper sandboxing and containerization. No need for complex setups - just pass your AWS credentials and start interacting with all AWS services.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [baryhuang](https://github.com/baryhuang) |
| **Repository** | https://github.com/baryhuang/mcp-server-aws-resources-python |
| **Dockerfile** | https://github.com/baryhuang/mcp-server-aws-resources-python/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`aws_resources_query_or_modify`**: Execute a boto3 code snippet to query or modify AWS resources

## Tools

### Tool: **`aws_resources_query_or_modify`**

Execute a boto3 code snippet to query or modify AWS resources

| Parameter | Type | Description |
| - | - | - |
| `code_snippet` | `string` | Python code using boto3 to query or modify AWS resources. The code should have default execution setting variable named 'result'. Example code: 'result = boto3.client('s3').list_buckets()' |

## Use this MCP Server

```json
{
  "mcpServers": {
    "baryhuang-mcp-server-aws-resources-python": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/baryhuang-mcp-server-aws-resources-python"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/baryhuang-mcp-server-aws-resources-python -f Dockerfile https://github.com/baryhuang/mcp-server-aws-resources-python.git
```


# AWK Core MCP Server MCP Server

Starting point for using the awslabs MCP servers.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/aws-core-mcp-server](https://hub.docker.com/repository/docker/mcp/aws-core-mcp-server)
**Author**|[awslabs](https://github.com/awslabs)
**Repository**|https://github.com/awslabs/mcp
**Dockerfile**|https://github.com/awslabs/mcp/blob/main/src/core-mcp-server/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/aws-core-mcp-server)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/aws-core-mcp-server --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`prompt_understanding`|MCP-CORE Prompt Understanding.|

---
## Tools Details

#### Tool: **`prompt_understanding`**
MCP-CORE Prompt Understanding.

    ALWAYS Use this tool first to understand the user's query and translate it into AWS expert advice.
## Use this MCP Server

```json
{
  "mcpServers": {
    "aws-core-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/aws-core-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

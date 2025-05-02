# Husqvarna Automower MCP Server

MCP Server for huqsvarna automower.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/husqvarna-automower](https://hub.docker.com/repository/docker/mcp/husqvarna-automower)
**Author**|[jeanlaurent](https://github.com/jeanlaurent)
**Repository**|https://github.com/jeanlaurent/mcp-husqvarna-automower
**Dockerfile**|https://github.com/jeanlaurent/mcp-husqvarna-automower/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/husqvarna-automower)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/husqvarna-automower --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|

## Available Tools
Tools provided by this Server|Short Description
-|-
`Husqvarna Automowers Status`|Get status of my husqvarna automowers|

---
## Tools Details

#### Tool: **`Husqvarna Automowers Status`**
Get status of my husqvarna automowers
## Use this MCP Server

```json
{
  "mcpServers": {
    "husqvarna-automower": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "HUSQVARNA_CLIENT_ID",
        "-e",
        "HUSQVARNA_CLIENT_SECRET",
        "mcp/husqvarna-automower"
      ],
      "env": {
        "HUSQVARNA_CLIENT_ID": "YOUR_CLIENT_ID_HERE",
        "HUSQVARNA_CLIENT_SECRET": "YOUR_CLIENT_SECRET_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

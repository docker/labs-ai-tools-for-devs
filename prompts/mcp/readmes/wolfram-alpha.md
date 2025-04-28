# WolframAlpha MCP Server

Connect your chat repl to wolfram alpha computational intelligence.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/wolfram-alpha](https://hub.docker.com/repository/docker/mcp/wolfram-alpha)
**Author**|[SecretiveShell](https://github.com/SecretiveShell)
**Repository**|https://github.com/SecretiveShell/MCP-wolfram-alpha
**Dockerfile**|https://github.com/SecretiveShell/MCP-wolfram-alpha/blob/master/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/wolfram-alpha)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`query-wolfram-alpha`|Use Wolfram Alpha to answer a question.|

---
## Tools Details

#### Tool: **`query-wolfram-alpha`**
Use Wolfram Alpha to answer a question. This tool should be used when you need complex math or symbolic intelligence.
Parameters|Type|Description
-|-|-
`query`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "wolfram-alpha": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "WOLFRAM_API_KEY",
        "mcp/wolfram-alpha"
      ],
      "env": {
        "WOLFRAM_API_KEY": "your-app-id"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

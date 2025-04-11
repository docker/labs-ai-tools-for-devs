# ahnlabio-bicscan-mcp MCP Server

BICScan MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [ahnlabio](https://github.com/ahnlabio) |
| **Repository** | https://github.com/ahnlabio/bicscan-mcp |
| **Dockerfile** | https://github.com/ahnlabio/bicscan-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`get_assets`**: Get Assets holdings by CryptoAddress
 1. **`get_risk_score`**: Get Risk Score for Crypto, Domain Name, ENS, CNS, KNS or even Hostname Address

## Tools

### Tool: **`get_assets`**

Get Assets holdings by CryptoAddress

| Parameter | Type | Description |
| - | - | - |
| `address` | `string` | EOA, CA, ENS, CNS, KNS. |

### Tool: **`get_risk_score`**

Get Risk Score for Crypto, Domain Name, ENS, CNS, KNS or even Hostname Address

| Parameter | Type | Description |
| - | - | - |
| `address` | `string` | EOA, CA, ENS, CNS, KNS or even HostName |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ahnlabio-bicscan-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/ahnlabio-bicscan-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ahnlabio-bicscan-mcp -f Dockerfile https://github.com/ahnlabio/bicscan-mcp.git
```


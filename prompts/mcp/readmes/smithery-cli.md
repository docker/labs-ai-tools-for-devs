# Smithery CLI MCP Server

Official MCP server for Smithery CLI.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/smithery-cli](https://hub.docker.com/repository/docker/mcp/smithery-cli)
**Author**|[smithery-ai](https://github.com/smithery-ai)
**Repository**|https://github.com/smithery-ai/smithery-cli-mcp
**Dockerfile**|https://github.com/smithery-ai/smithery-cli-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/smithery-cli)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/smithery-cli --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|GNU General Public License v3.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`collect_config`|Collect the config to be used for connection to mcp server|
`find_mcp`|Find the MCP servers by given name|
`install_mcp`|Install the MCP server on your local machine.|

---
## Tools Details

#### Tool: **`collect_config`**
Collect the config to be used for connection to mcp server
Parameters|Type|Description
-|-|-
`qualifiedName`|`string`|The qualified name of the config to collect

---
#### Tool: **`find_mcp`**
Find the MCP servers by given name
Parameters|Type|Description
-|-|-
`mcpServerName`|`string`|The name of the MCP server to find

---
#### Tool: **`install_mcp`**
Install the MCP server on your local machine. You can install the MCP server with configuration.
Parameters|Type|Description
-|-|-
`client`|`string`|The client to install
`qualifiedName`|`string`|The qualified name of the MCP server to install. ex) @bbangjooo/mcp-finder-mcp-server
`config`|`object` *optional*|Configuration schema

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "smithery-cli": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SMITHERY_API_KEY",
        "mcp/smithery-cli"
      ],
      "env": {
        "SMITHERY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

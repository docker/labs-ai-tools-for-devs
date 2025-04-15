# hyperspell MCP Server

Hyperspell MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[hyperspell](https://github.com/hyperspell)
**Repository**|https://github.com/hyperspell/hyperspell-mcp
**Dockerfile**|https://github.com/hyperspell/hyperspell-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|

## Summary
1. `Add File` Add a file or website from a URL to Hyperspell.
1. `Add Memory` Add a plain text document or memory to Hyperspell.
1. `Search Hyperspell` Search Hyperspell for documents and data.

## Tools

### Tool `Add File`
Add a file or website from a URL to Hyperspell.

Parameter|Type|Description
-|-|-
`url`|`string`|

### Tool `Add Memory`
Add a plain text document or memory to Hyperspell.

Parameter|Type|Description
-|-|-
`text`|`string`|
`title`|`string` *optional*|

### Tool `Search Hyperspell`
Search Hyperspell for documents and data.

Parameter|Type|Description
-|-|-
`query`|`string`|

## Use this MCP Server

```json
{
  "mcpServers": {
    "hyperspell": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "USE_RESOURCES",
        "-e",
        "HYPERSPELL_COLLECTION",
        "-e",
        "HYPERSPELL_TOKEN",
        "mcp/hyperspell"
      ],
      "env": {
        "USE_RESOURCES": "false",
        "HYPERSPELL_COLLECTION": "",
        "HYPERSPELL_TOKEN": "<app or user token>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

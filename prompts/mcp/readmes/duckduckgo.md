# DuckDuckGo MCP Server

A Model Context Protocol (MCP) server that provides web search capabilities through DuckDuckGo, with additional features for content fetching and parsing.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/duckduckgo](https://hub.docker.com/repository/docker/mcp/duckduckgo)
**Author**|[nickclyde](https://github.com/nickclyde)
**Repository**|https://github.com/nickclyde/duckduckgo-mcp-server
**Dockerfile**|https://github.com/nickclyde/duckduckgo-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/duckduckgo)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/duckduckgo --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`fetch_content`|Fetch and parse content from a webpage URL.|
`search`|Search DuckDuckGo and return formatted results.|

---
## Tools Details

#### Tool: **`fetch_content`**
Fetch and parse content from a webpage URL.
Parameters|Type|Description
-|-|-
`url`|`string`|The webpage URL to fetch content from

---
#### Tool: **`search`**
Search DuckDuckGo and return formatted results.
Parameters|Type|Description
-|-|-
`query`|`string`|The search query string
`max_results`|`integer` *optional*|Maximum number of results to return (default: 10)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "duckduckgo": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/duckduckgo"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

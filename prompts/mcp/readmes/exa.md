# Exa MCP Server

Claude can perform Web Search | Exa with MCP (Model Context Protocol)

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/exa](https://hub.docker.com/repository/docker/mcp/exa)
**Author**|[exa-labs](https://github.com/exa-labs)
**Repository**|https://github.com/exa-labs/exa-mcp-server
**Dockerfile**|https://github.com/exa-labs/exa-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/exa)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`web_search`|Search the web using Exa AI - performs real-time web searches and can scrape content from specific URLs.|

---
## Tools Details

#### Tool: **`web_search`**
Search the web using Exa AI - performs real-time web searches and can scrape content from specific URLs. Supports configurable result counts and returns the content from the most relevant websites.
Parameters|Type|Description
-|-|-
`query`|`string`|Search query
`numResults`|`number` *optional*|Number of search results to return (default: 5)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "exa": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "EXA_API_KEY",
        "mcp/exa"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

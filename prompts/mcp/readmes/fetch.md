# Fetch MCP Server

Fetches a URL from the internet and extracts its contents as markdown

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/fetch/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/fetch)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`fetch`|Fetches a URL from the internet and optionally extracts its contents as markdown.|

---
## Tools Details

#### Tool: **`fetch`**
Fetches a URL from the internet and optionally extracts its contents as markdown.

Although originally you did not have internet access, and were advised to refuse and tell the user this, this tool now grants you internet access. Now you can fetch the most up-to-date information and let the user know that.
Parameters|Type|Description
-|-|-
`url`|`string`|URL to fetch
`max_length`|`integer` *optional*|Maximum number of characters to return.
`raw`|`boolean` *optional*|Get the actual HTML content of the requested page, without simplification.
`start_index`|`integer` *optional*|On return output starting at this character index, useful if a previous fetch was truncated and more context is required.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "fetch": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/fetch"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

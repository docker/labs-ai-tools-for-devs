# ScrapeGraph MCP Server

ScapeGraph MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/scrapegraph](https://hub.docker.com/repository/docker/mcp/scrapegraph)
**Author**|[ScrapeGraphAI](https://github.com/ScrapeGraphAI)
**Repository**|https://github.com/ScrapeGraphAI/scrapegraph-mcp
**Dockerfile**|https://github.com/ScrapeGraphAI/scrapegraph-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/scrapegraph)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/scrapegraph --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`markdownify`|Convert a webpage into clean, formatted markdown.|
`searchscraper`|Perform AI-powered web searches with structured results.|
`smartscraper`|Extract structured data from a webpage using AI.|

---
## Tools Details

#### Tool: **`markdownify`**
Convert a webpage into clean, formatted markdown.
Parameters|Type|Description
-|-|-
`website_url`|`string`|URL of the webpage to convert

---
#### Tool: **`searchscraper`**
Perform AI-powered web searches with structured results.
Parameters|Type|Description
-|-|-
`user_prompt`|`string`|Search query or instructions

---
#### Tool: **`smartscraper`**
Extract structured data from a webpage using AI.
Parameters|Type|Description
-|-|-
`user_prompt`|`string`|Instructions for what data to extract
`website_url`|`string`|URL of the webpage to scrape

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "scrapegraph": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SGAI_API_KEY",
        "mcp/scrapegraph"
      ],
      "env": {
        "SGAI_API_KEY": "YOUR_SGAI_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

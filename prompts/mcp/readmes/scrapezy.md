# Scrapezy MCP Server

A Model Context Protocol server for Scrapezy that enables AI models to extract structured data from websites.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/scrapezy](https://hub.docker.com/repository/docker/mcp/scrapezy)
**Author**|[Scrapezy](https://github.com/Scrapezy)
**Repository**|https://github.com/Scrapezy/mcp
**Dockerfile**|https://github.com/Scrapezy/mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/scrapezy)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/scrapezy --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`extract-structured-data`|Extract structured data from a website.|

---
## Tools Details

#### Tool: **`extract-structured-data`**
Extract structured data from a website.
Parameters|Type|Description
-|-|-
`prompt`|`string`|Prompt to extract data from the website
`url`|`string`|URL of the website to extract data from

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "scrapezy": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SCRAPEZY_API_KEY",
        "mcp/scrapezy"
      ],
      "env": {
        "SCRAPEZY_API_KEY": "your_api_key"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

# Atlas Docs MCP Server

Provide LLMs hosted, clean markdown documentation of libraries and frameworks.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/atlas-docs](https://hub.docker.com/repository/docker/mcp/atlas-docs)
**Author**|[CartographAI](https://github.com/CartographAI)
**Repository**|https://github.com/CartographAI/atlas-docs-mcp
**Dockerfile**|https://github.com/CartographAI/atlas-docs-mcp/blob/master/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/atlas-docs)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/atlas-docs --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_docs_full`|Retrieves the complete documentation content in a single consolidated file.|
`get_docs_index`|Retrieves a condensed, LLM-friendly index of the pages in a documentation set.|
`get_docs_page`|Retrieves a specific documentation page's content using its relative path.|
`list_docs`|Lists all available documentation libraries and frameworks.|
`search_docs`|Searches a documentation set for specific content.|

---
## Tools Details

#### Tool: **`get_docs_full`**
Retrieves the complete documentation content in a single consolidated file. Use this when you need comprehensive knowledge or need to analyze the full documentation context. Returns a large volume of text - consider using get_docs_page or search_docs for targeted information.
Parameters|Type|Description
-|-|-
`docName`|`string`|Name of the documentation set

---
#### Tool: **`get_docs_index`**
Retrieves a condensed, LLM-friendly index of the pages in a documentation set. Use this for initial exploration to understand what's covered and identify relevant pages. Returns a markdown page with a list of available pages. Follow up with get_docs_page to get full content.
Parameters|Type|Description
-|-|-
`docName`|`string`|Name of the documentation set

---
#### Tool: **`get_docs_page`**
Retrieves a specific documentation page's content using its relative path. Use this to get detailed information about a known topic, after identifying the relevant page through get_docs_index or search_docs. Returns the complete content of a single documentation page.
Parameters|Type|Description
-|-|-
`docName`|`string`|Name of the documentation set
`pagePath`|`string`|The root-relative path of the specific documentation page (e.g., '/guides/getting-started', '/api/authentication')

---
#### Tool: **`list_docs`**
Lists all available documentation libraries and frameworks. Use this as your first step to discover available documentation sets. Returns name, description and source url for each documentation set. Required before using other documentation tools since you need the docName.
#### Tool: **`search_docs`**
Searches a documentation set for specific content. Use this to find pages containing particular keywords, concepts, or topics. Returns matching pages ranked by relevance with their paths and descriptions. Follow up with get_docs_page to get full content.
Parameters|Type|Description
-|-|-
`docName`|`string`|Name of the documentation set
`query`|`string`|Search query to find relevant pages within the documentation set

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "atlas-docs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ATLAS_API_URL",
        "mcp/atlas-docs"
      ],
      "env": {
        "ATLAS_API_URL": "https://atlas.cartograph.app/api"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

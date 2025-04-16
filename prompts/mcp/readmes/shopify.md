# Shopify MCP Server

Shopify.dev MCP server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[Shopify](https://github.com/Shopify)
**Repository**|https://github.com/Shopify/dev-mcp
**Dockerfile**|https://github.com/Shopify/dev-mcp/blob/refs/pull/7/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|ISC License

## Available Tools
Tools provided by this Server|Short Description
-|-
`introspect_admin_schema`|This tool introspects and returns the portion of the Shopify Admin API GraphQL schema relevant to the user prompt.|
`search_dev_docs`|This tool will take in the user prompt, search shopify.dev, and return relevant documentation that will help answer the user's question.|

---
## Tools Details

#### Tool: `introspect_admin_schema`
|Description|
|-|
|This tool introspects and returns the portion of the Shopify Admin API GraphQL schema relevant to the user prompt. Only use this for the Shopify Admin API, and not any other APIs like the Shopify Storefront API or the Shopify Functions API.

    It takes two arguments: query and filter. The query argument is the string search term to filter schema elements by name. The filter argument is an array of strings to filter results to show specific sections.|

Parameters|Type|Description
-|-|-
`query`|`string`|Search term to filter schema elements by name. Only pass simple terms like 'product', 'discountProduct', etc.
`filter`|`array` *optional*|Filter results to show specific sections. Can include 'types', 'queries', 'mutations', or 'all' (default)

---
#### Tool: `search_dev_docs`
|Description|
|-|
|This tool will take in the user prompt, search shopify.dev, and return relevant documentation that will help answer the user's question.

    It takes one argument: prompt, which is the search query for Shopify documentation.|

Parameters|Type|Description
-|-|-
`prompt`|`string`|The search query for Shopify documentation

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "shopify": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/shopify"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

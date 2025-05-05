# Wikipedia MCP Server

A Model Context Protocol (MCP) server that retrieves information from Wikipedia to provide context to LLMs.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/wikipedia-mcp](https://hub.docker.com/repository/docker/mcp/wikipedia-mcp)
**Author**|[Rudra-ravi](https://github.com/Rudra-ravi)
**Repository**|https://github.com/Rudra-ravi/wikipedia-mcp
**Dockerfile**|https://github.com/Rudra-ravi/wikipedia-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/wikipedia-mcp)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/wikipedia-mcp --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_article`|Get the full content of a Wikipedia article.|
`get_related_topics`|Get topics related to a Wikipedia article based on links and categories.|
`get_summary`|Get a summary of a Wikipedia article.|
`search_wikipedia`|Search Wikipedia for articles matching a query.|

---
## Tools Details

#### Tool: **`get_article`**
Get the full content of a Wikipedia article.
Parameters|Type|Description
-|-|-
`title`|`string`|

---
#### Tool: **`get_related_topics`**
Get topics related to a Wikipedia article based on links and categories.
Parameters|Type|Description
-|-|-
`title`|`string`|
`limit`|`integer` *optional*|

---
#### Tool: **`get_summary`**
Get a summary of a Wikipedia article.
Parameters|Type|Description
-|-|-
`title`|`string`|

---
#### Tool: **`search_wikipedia`**
Search Wikipedia for articles matching a query.
Parameters|Type|Description
-|-|-
`query`|`string`|
`limit`|`integer` *optional*|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "wikipedia-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/wikipedia-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

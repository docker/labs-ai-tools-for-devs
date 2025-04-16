# Databutton MCP Server

Databutton MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[databutton](https://github.com/databutton)
**Repository**|https://github.com/databutton/databutton-mcp
**Dockerfile**|https://github.com/databutton/databutton-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/databutton)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`submit_app_requirements`|Submit app requirements|

---
## Tools Details

#### Tool: **`submit_app_requirements`**
Submit app requirements
Parameters|Type|Description
-|-|-
`name`|`string`|The name of the app
`pitch`|`string`|The pitch for the app
`spec`|`object`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "databutton": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/databutton"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

# Osp_marketing_tools MCP Server

A Model Context Protocol (MCP) server that empowers LLMs to use some of Open Srategy Partners' core writing and product marketing techniques.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/osp_marketing_tools](https://hub.docker.com/repository/docker/mcp/osp_marketing_tools)
**Author**|[open-strategy-partners](https://github.com/open-strategy-partners)
**Repository**|https://github.com/open-strategy-partners/osp_marketing_tools
**Dockerfile**|https://github.com/open-strategy-partners/osp_marketing_tools/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/osp_marketing_tools)
**Licence**|Creative Commons Attribution Share Alike 4.0 International

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_editing_codes`|Get the Open Strategy Partners (OSP) editing codes documentation and usage protocol for editing texts.|
`get_meta_guide`|Get the Open Strategy Partners (OSP) Web Content Meta Information Generation System (titles, meta-titles, slugs).|
`get_on_page_seo_guide`|Get the Open Strategy Partners (OSP) On-Page SEO Optimization Guide.|
`get_value_map_positioning_guide`|Get the Open Strategy Partners (OSP) Product Communications Value Map Generation System for Product Positioning (value cases, feature extraction, taglines).|
`get_writing_guide`|Get the Open Strategy Partners (OSP) writing guide and usage protocol for editing texts.|
`health_check`|Check if the server is running and can access its resources|

---
## Tools Details

#### Tool: **`get_editing_codes`**
Get the Open Strategy Partners (OSP) editing codes documentation and usage protocol for editing texts.
#### Tool: **`get_meta_guide`**
Get the Open Strategy Partners (OSP) Web Content Meta Information Generation System (titles, meta-titles, slugs).
#### Tool: **`get_on_page_seo_guide`**
Get the Open Strategy Partners (OSP) On-Page SEO Optimization Guide.
#### Tool: **`get_value_map_positioning_guide`**
Get the Open Strategy Partners (OSP) Product Communications Value Map Generation System for Product Positioning (value cases, feature extraction, taglines).
#### Tool: **`get_writing_guide`**
Get the Open Strategy Partners (OSP) writing guide and usage protocol for editing texts.
#### Tool: **`health_check`**
Check if the server is running and can access its resources
## Use this MCP Server

```json
{
  "mcpServers": {
    "osp_marketing_tools": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/osp_marketing_tools"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

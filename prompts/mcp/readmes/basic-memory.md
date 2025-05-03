# Basic Memory MCP Server

Basic Memory is a knowledge management system that allows you to build a persistent semantic graph from conversations with AI assistants, stored in standard Markdown files on your computer. Integrates directly with Obsidan.md.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/basic-memory](https://hub.docker.com/repository/docker/mcp/basic-memory)
**Author**|[basicmachines-co](https://github.com/basicmachines-co)
**Repository**|https://github.com/basicmachines-co/basic-memory
**Dockerfile**|https://github.com/basicmachines-co/basic-memory/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/basic-memory)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/basic-memory --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|GNU Affero General Public License v3.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`build_context`|Build context from a memory:// URI to continue conversations naturally.|
`canvas`|Create an Obsidian canvas file to visualize concepts and connections.|
`delete_note`|Delete a note by title or permalink|
`project_info`|Get information and statistics about the current Basic Memory project.|
`read_content`|Read a file's raw content by path or permalink|
`read_note`|Read a markdown note by title or permalink.|
`recent_activity`|Get recent activity from across the knowledge base.|
`search_notes`|Search across all content in the knowledge base.|
`write_note`|Create or update a markdown note.|

---
## Tools Details

#### Tool: **`build_context`**
Build context from a memory:// URI to continue conversations naturally.

    Use this to follow up on previous discussions or explore related topics.
    Timeframes support natural language like:
    - "2 days ago"
    - "last week" 
    - "today"
    - "3 months ago"
    Or standard formats like "7d", "24h"
Parameters|Type|Description
-|-|-
`url`|`string`|
`depth`|`string` *optional*|
`max_related`|`integer` *optional*|
`page`|`integer` *optional*|
`page_size`|`integer` *optional*|
`timeframe`|`string` *optional*|

---
#### Tool: **`canvas`**
Create an Obsidian canvas file to visualize concepts and connections.
Parameters|Type|Description
-|-|-
`edges`|`array`|
`folder`|`string`|
`nodes`|`array`|
`title`|`string`|

---
#### Tool: **`delete_note`**
Delete a note by title or permalink
Parameters|Type|Description
-|-|-
`identifier`|`string`|

---
#### Tool: **`project_info`**
Get information and statistics about the current Basic Memory project.
#### Tool: **`read_content`**
Read a file's raw content by path or permalink
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`read_note`**
Read a markdown note by title or permalink.
Parameters|Type|Description
-|-|-
`identifier`|`string`|
`page`|`integer` *optional*|
`page_size`|`integer` *optional*|

---
#### Tool: **`recent_activity`**
Get recent activity from across the knowledge base.

    Timeframe supports natural language formats like:
    - "2 days ago"  
    - "last week"
    - "yesterday" 
    - "today"
    - "3 weeks ago"
    Or standard formats like "7d"
Parameters|Type|Description
-|-|-
`depth`|`integer` *optional*|
`max_related`|`integer` *optional*|
`page`|`integer` *optional*|
`page_size`|`integer` *optional*|
`timeframe`|`string` *optional*|
`type`|`string` *optional*|

---
#### Tool: **`search_notes`**
Search across all content in the knowledge base.
Parameters|Type|Description
-|-|-
`query`|`string`|
`after_date`|`string` *optional*|
`entity_types`|`string` *optional*|
`page`|`integer` *optional*|
`page_size`|`integer` *optional*|
`search_type`|`string` *optional*|
`types`|`string` *optional*|

---
#### Tool: **`write_note`**
Create or update a markdown note. Returns a markdown formatted summary of the semantic content.
Parameters|Type|Description
-|-|-
`content`|`string`|
`folder`|`string`|
`title`|`string`|
`tags`|`string` *optional*|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "basic-memory": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/basic-memory"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

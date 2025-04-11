# basic-memory MCP Server

Basic Memory is a knowledge management system that allows you to build a persistent semantic graph from conversations with AI assistants. All knowledge is stored in standard Markdown files on your computer, giving you full control and ownership of your data. Integrates directly with Obsidan.md

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [basicmachines-co](https://github.com/basicmachines-co) |
| **Repository** | https://github.com/basicmachines-co/basic-memory |
| **Dockerfile** | https://github.com/basicmachines-co/basic-memory/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | GNU Affero General Public License v3.0 |

## Tools Summary

 1. **`build_context`**: Build context from a memory:// URI to continue conversations naturally.

    Use this to follow up on previous discussions or explore related topics.
    Timeframes support natural language like:
    - "2 days ago"
    - "last week" 
    - "today"
    - "3 months ago"
    Or standard formats like "7d", "24h"
 1. **`canvas`**: Create an Obsidian canvas file to visualize concepts and connections.
 1. **`delete_note`**: Delete a note by title or permalink
 1. **`project_info`**: Get information and statistics about the current Basic Memory project.
 1. **`read_content`**: Read a file's raw content by path or permalink
 1. **`read_note`**: Read a markdown note by title or permalink.
 1. **`recent_activity`**: Get recent activity from across the knowledge base.

    Timeframe supports natural language formats like:
    - "2 days ago"  
    - "last week"
    - "yesterday" 
    - "today"
    - "3 weeks ago"
    Or standard formats like "7d"
 1. **`search_notes`**: Search across all content in the knowledge base.
 1. **`write_note`**: Create or update a markdown note. Returns a markdown formatted summary of the semantic content.

## Tools

### Tool: **`build_context`**

Build context from a memory:// URI to continue conversations naturally.

    Use this to follow up on previous discussions or explore related topics.
    Timeframes support natural language like:
    - "2 days ago"
    - "last week" 
    - "today"
    - "3 months ago"
    Or standard formats like "7d", "24h"

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` |  |
| `depth` | `string` *optional* |  |
| `max_related` | `integer` *optional* |  |
| `page` | `integer` *optional* |  |
| `page_size` | `integer` *optional* |  |
| `timeframe` | `string` *optional* |  |

### Tool: **`canvas`**

Create an Obsidian canvas file to visualize concepts and connections.

| Parameter | Type | Description |
| - | - | - |
| `edges` | `array` |  |
| `folder` | `string` |  |
| `nodes` | `array` |  |
| `title` | `string` |  |

### Tool: **`delete_note`**

Delete a note by title or permalink

| Parameter | Type | Description |
| - | - | - |
| `identifier` | `string` |  |

### Tool: **`project_info`**

Get information and statistics about the current Basic Memory project.

### Tool: **`read_content`**

Read a file's raw content by path or permalink

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` |  |

### Tool: **`read_note`**

Read a markdown note by title or permalink.

| Parameter | Type | Description |
| - | - | - |
| `identifier` | `string` |  |
| `page` | `integer` *optional* |  |
| `page_size` | `integer` *optional* |  |

### Tool: **`recent_activity`**

Get recent activity from across the knowledge base.

    Timeframe supports natural language formats like:
    - "2 days ago"  
    - "last week"
    - "yesterday" 
    - "today"
    - "3 weeks ago"
    Or standard formats like "7d"

| Parameter | Type | Description |
| - | - | - |
| `depth` | `string` *optional* |  |
| `max_related` | `integer` *optional* |  |
| `page` | `integer` *optional* |  |
| `page_size` | `integer` *optional* |  |
| `timeframe` | `string` *optional* |  |
| `type` | `string` *optional* |  |

### Tool: **`search_notes`**

Search across all content in the knowledge base.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` |  |
| `after_date` | `string` *optional* |  |
| `entity_types` | `string` *optional* |  |
| `page` | `integer` *optional* |  |
| `page_size` | `integer` *optional* |  |
| `search_type` | `string` *optional* |  |
| `types` | `string` *optional* |  |

### Tool: **`write_note`**

Create or update a markdown note. Returns a markdown formatted summary of the semantic content.

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` |  |
| `folder` | `string` |  |
| `title` | `string` |  |
| `tags` | `string` *optional* |  |

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

## Rebuild this image

```console
docker build -t mcp/basic-memory -f Dockerfile https://github.com/basicmachines-co/basic-memory.git
```


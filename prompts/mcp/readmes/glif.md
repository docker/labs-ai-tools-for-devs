# glif MCP Server

Easily run glif.app AI workflows inside your LLM: image generators, memes, selfies, and more. Glif supports all major multimedia AI models inside one app

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [glifxyz](https://github.com/glifxyz) |
| **Repository** | https://github.com/glifxyz/glif-mcp-server |
| **Dockerfile** | https://github.com/glifxyz/glif-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`glif_info`**: Get detailed information about a glif including input fields
 1. **`list_bots`**: Get a list of bots and sim templates with optional filtering and sorting. Supports sort={new,popular,featured} (defaults to popular), username filtering, and text search.
 1. **`list_featured_glifs`**: Get a curated list of featured glifs
 1. **`list_saved_glif_tools`**: List all saved glif tools
 1. **`load_bot`**: Get detailed information about a specific bot
 1. **`my_glif_user_info`**: Get detailed information about your user account, recent glifs, and recent runs
 1. **`my_glifs`**: Get a list of your glifs
 1. **`remove_all_glif_tools`**: Remove all saved glif tools and return to a pristine state
 1. **`remove_glif_tool`**: Remove a saved glif tool
 1. **`run_glif`**: Run a glif with the specified ID and inputs
 1. **`save_bot_skills_as_tools`**: Save all skills from a bot as individual tools
 1. **`save_glif_as_tool`**: Save a glif as a custom tool
 1. **`search_glifs`**: Search for glifs by query string
 1. **`show_bot_info`**: Get detailed information about a specific bot (alias for load_bot)

## Tools

### Tool: **`glif_info`**

Get detailed information about a glif including input fields

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the glif to show details for |

### Tool: **`list_bots`**

Get a list of bots and sim templates with optional filtering and sorting. Supports sort={new,popular,featured} (defaults to popular), username filtering, and text search.

| Parameter | Type | Description |
| - | - | - |
| `searchQuery` | `string` *optional* | Optional search query to filter bots by name or description |
| `sort` | `string` *optional* | Optional sort order for bots (defaults to featured) |
| `username` | `string` *optional* | Optional filter for bots by creator username |

### Tool: **`list_featured_glifs`**

Get a curated list of featured glifs

### Tool: **`list_saved_glif_tools`**

List all saved glif tools

### Tool: **`load_bot`**

Get detailed information about a specific bot

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the bot to load |

### Tool: **`my_glif_user_info`**

Get detailed information about your user account, recent glifs, and recent runs

### Tool: **`my_glifs`**

Get a list of your glifs

### Tool: **`remove_all_glif_tools`**

Remove all saved glif tools and return to a pristine state

### Tool: **`remove_glif_tool`**

Remove a saved glif tool

| Parameter | Type | Description |
| - | - | - |
| `toolName` | `string` | The tool name of the saved glif to remove |

### Tool: **`run_glif`**

Run a glif with the specified ID and inputs

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the glif to run |
| `inputs` | `array` | Array of input values for the glif |

### Tool: **`save_bot_skills_as_tools`**

Save all skills from a bot as individual tools

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the bot whose skills to save |
| `prefix` | `string` *optional* | Optional prefix to add to tool names (e.g., 'tshirt_') |

### Tool: **`save_glif_as_tool`**

Save a glif as a custom tool

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the glif to save |
| `toolName` | `string` | The name to use for the tool (must be unique) |
| `description` | `string` *optional* | Optional custom description (defaults to glif description) |
| `name` | `string` *optional* | Optional custom name for the tool (defaults to glif name) |

### Tool: **`search_glifs`**

Search for glifs by query string

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query string |

### Tool: **`show_bot_info`**

Get detailed information about a specific bot (alias for load_bot)

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the bot to show details for |

## Use this MCP Server

```json
{
  "mcpServers": {
    "glif": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GLIF_IDS",
        "-e",
        "IGNORE_SAVED_GLIFS",
        "-e",
        "GLIF_API_TOKEN",
        "mcp/glif"
      ],
      "env": {
        "GLIF_IDS": "",
        "IGNORE_SAVED_GLIFS": "false",
        "GLIF_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/glif -f Dockerfile https://github.com/glifxyz/glif-mcp-server.git
```


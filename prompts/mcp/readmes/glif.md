# glif.app MCP Server

Easily run glif.app AI workflows inside your LLM: image generators, memes, selfies, and more. Glif supports all major multimedia AI models inside one app.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/glif](https://hub.docker.com/repository/docker/mcp/glif)
**Author**|[glifxyz](https://github.com/glifxyz)
**Repository**|https://github.com/glifxyz/glif-mcp-server
**Dockerfile**|https://github.com/glifxyz/glif-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/glif)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`glif_info`|Get detailed information about a glif including input fields|
`list_featured_glifs`|Get a curated list of featured glifs|
`list_saved_glif_tools`|List all saved glif tools|
`my_glif_user_info`|Get detailed information about your user account, recent glifs, and recent runs|
`my_glifs`|Get a list of your glifs|
`remove_all_glif_tools`|Remove all saved glif tools and return to a pristine state|
`remove_glif_tool`|Remove a saved glif tool|
`run_glif`|Run a glif with the specified ID and inputs|
`save_glif_as_tool`|Save a glif as a custom tool|
`search_glifs`|Search for glifs by query string|

---
## Tools Details

#### Tool: **`glif_info`**
Get detailed information about a glif including input fields
Parameters|Type|Description
-|-|-
`id`|`string`|The ID of the glif to show details for

---
#### Tool: **`list_featured_glifs`**
Get a curated list of featured glifs
#### Tool: **`list_saved_glif_tools`**
List all saved glif tools
#### Tool: **`my_glif_user_info`**
Get detailed information about your user account, recent glifs, and recent runs
#### Tool: **`my_glifs`**
Get a list of your glifs
#### Tool: **`remove_all_glif_tools`**
Remove all saved glif tools and return to a pristine state
#### Tool: **`remove_glif_tool`**
Remove a saved glif tool
Parameters|Type|Description
-|-|-
`toolName`|`string`|The tool name of the saved glif to remove

---
#### Tool: **`run_glif`**
Run a glif with the specified ID and inputs
Parameters|Type|Description
-|-|-
`id`|`string`|The ID of the glif to run
`inputs`|`array`|Array of input values for the glif

---
#### Tool: **`save_glif_as_tool`**
Save a glif as a custom tool
Parameters|Type|Description
-|-|-
`id`|`string`|The ID of the glif to save
`toolName`|`string`|The name to use for the tool (must be unique)
`description`|`string` *optional*|Optional custom description (defaults to glif description)
`name`|`string` *optional*|Optional custom name for the tool (defaults to glif name)

---
#### Tool: **`search_glifs`**
Search for glifs by query string
Parameters|Type|Description
-|-|-
`query`|`string`|Search query string

---
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

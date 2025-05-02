# Obsidian MCP Server

MCP server that interacts with Obsidian via the Obsidian rest API community plugin.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/obsidian](https://hub.docker.com/repository/docker/mcp/obsidian)
**Author**|[MarkusPfundstein](https://github.com/MarkusPfundstein)
**Repository**|https://github.com/MarkusPfundstein/mcp-obsidian
**Dockerfile**|https://github.com/slimslenderslacks/mcp-obsidian/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/obsidian)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/obsidian --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`obsidian_append_content`|Append content to a new or existing file in the vault.|
`obsidian_batch_get_file_contents`|Return the contents of multiple files in your vault, concatenated with headers.|
`obsidian_complex_search`|Complex search for documents using a JsonLogic query.|
`obsidian_delete_file`|Delete a file or directory from the vault.|
`obsidian_get_file_contents`|Return the content of a single file in your vault.|
`obsidian_get_periodic_note`|Get current periodic note for the specified period.|
`obsidian_get_recent_changes`|Get recently modified files in the vault.|
`obsidian_get_recent_periodic_notes`|Get most recent periodic notes for the specified period type.|
`obsidian_list_files_in_dir`|Lists all files and directories that exist in a specific Obsidian directory.|
`obsidian_list_files_in_vault`|Lists all files and directories in the root directory of your Obsidian vault.|
`obsidian_patch_content`|Insert content into an existing note relative to a heading, block reference, or frontmatter field.|
`obsidian_simple_search`|Simple search for documents matching a specified text query across all files in the vault.|

---
## Tools Details

#### Tool: **`obsidian_append_content`**
Append content to a new or existing file in the vault.
Parameters|Type|Description
-|-|-
`content`|`string`|Content to append to the file
`filepath`|`string`|Path to the file (relative to vault root)

---
#### Tool: **`obsidian_batch_get_file_contents`**
Return the contents of multiple files in your vault, concatenated with headers.
Parameters|Type|Description
-|-|-
`filepaths`|`array`|List of file paths to read

---
#### Tool: **`obsidian_complex_search`**
Complex search for documents using a JsonLogic query. 
           Supports standard JsonLogic operators plus 'glob' and 'regexp' for pattern matching. Results must be non-falsy.

           Use this tool when you want to do a complex search, e.g. for all documents with certain tags etc.
Parameters|Type|Description
-|-|-
`query`|`object`|JsonLogic query object. Example: {"glob": ["*.md", {"var": "path"}]} matches all markdown files

---
#### Tool: **`obsidian_delete_file`**
Delete a file or directory from the vault.
Parameters|Type|Description
-|-|-
`confirm`|`boolean`|Confirmation to delete the file (must be true)
`filepath`|`string`|Path to the file or directory to delete (relative to vault root)

---
#### Tool: **`obsidian_get_file_contents`**
Return the content of a single file in your vault.
Parameters|Type|Description
-|-|-
`filepath`|`string`|Path to the relevant file (relative to your vault root).

---
#### Tool: **`obsidian_get_periodic_note`**
Get current periodic note for the specified period.
Parameters|Type|Description
-|-|-
`period`|`string`|The period type (daily, weekly, monthly, quarterly, yearly)

---
#### Tool: **`obsidian_get_recent_changes`**
Get recently modified files in the vault.
Parameters|Type|Description
-|-|-
`days`|`integer` *optional*|Only include files modified within this many days (default: 90)
`limit`|`integer` *optional*|Maximum number of files to return (default: 10)

---
#### Tool: **`obsidian_get_recent_periodic_notes`**
Get most recent periodic notes for the specified period type.
Parameters|Type|Description
-|-|-
`period`|`string`|The period type (daily, weekly, monthly, quarterly, yearly)
`include_content`|`boolean` *optional*|Whether to include note content (default: false)
`limit`|`integer` *optional*|Maximum number of notes to return (default: 5)

---
#### Tool: **`obsidian_list_files_in_dir`**
Lists all files and directories that exist in a specific Obsidian directory.
Parameters|Type|Description
-|-|-
`dirpath`|`string`|Path to list files from (relative to your vault root). Note that empty directories will not be returned.

---
#### Tool: **`obsidian_list_files_in_vault`**
Lists all files and directories in the root directory of your Obsidian vault.
#### Tool: **`obsidian_patch_content`**
Insert content into an existing note relative to a heading, block reference, or frontmatter field.
Parameters|Type|Description
-|-|-
`content`|`string`|Content to insert
`filepath`|`string`|Path to the file (relative to vault root)
`operation`|`string`|Operation to perform (append, prepend, or replace)
`target`|`string`|Target identifier (heading path, block reference, or frontmatter field)
`target_type`|`string`|Type of target to patch

---
#### Tool: **`obsidian_simple_search`**
Simple search for documents matching a specified text query across all files in the vault. 
            Use this tool when you want to do a simple text search
Parameters|Type|Description
-|-|-
`query`|`string`|Text to a simple search for in the vault.
`context_length`|`integer` *optional*|How much context to return around the matching string (default: 100)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "OBSIDIAN_API_KEY",
        "mcp/obsidian"
      ],
      "env": {
        "OBSIDIAN_API_KEY": "YOUR_OBSIDIAN_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

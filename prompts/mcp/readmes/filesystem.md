# Filesystem (Reference) MCP Server

Local filesystem access with configurable allowed paths.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/filesystem](https://hub.docker.com/repository/docker/mcp/filesystem)
**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/filesystem/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/filesystem)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/filesystem --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_directory`|Create a new directory or ensure a directory exists.|
`directory_tree`|Get a recursive tree view of files and directories as a JSON structure.|
`edit_file`|Make line-based edits to a text file.|
`get_file_info`|Retrieve detailed metadata about a file or directory.|
`list_allowed_directories`|Returns the list of directories that this server is allowed to access.|
`list_directory`|Get a detailed listing of all files and directories in a specified path.|
`move_file`|Move or rename files and directories.|
`read_file`|Read the complete contents of a file from the file system.|
`read_multiple_files`|Read the contents of multiple files simultaneously.|
`search_files`|Recursively search for files and directories matching a pattern.|
`write_file`|Create a new file or completely overwrite an existing file with new content.|

---
## Tools Details

#### Tool: **`create_directory`**
Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. If the directory already exists, this operation will succeed silently. Perfect for setting up directory structures for projects or ensuring required paths exist. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`directory_tree`**
Get a recursive tree view of files and directories as a JSON structure. Each entry includes 'name', 'type' (file/directory), and 'children' for directories. Files have no children array, while directories always have a children array (which may be empty). The output is formatted with 2-space indentation for readability. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`edit_file`**
Make line-based edits to a text file. Each edit replaces exact line sequences with new content. Returns a git-style diff showing the changes made. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`edits`|`array`|
`path`|`string`|
`dryRun`|`boolean` *optional*|Preview changes using git-style diff format

---
#### Tool: **`get_file_info`**
Retrieve detailed metadata about a file or directory. Returns comprehensive information including size, creation time, last modified time, permissions, and type. This tool is perfect for understanding file characteristics without reading the actual content. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`list_allowed_directories`**
Returns the list of directories that this server is allowed to access. Use this to understand which directories are available before trying to access files.
#### Tool: **`list_directory`**
Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory structure and finding specific files within a directory. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`move_file`**
Move or rename files and directories. Can move files between directories and rename them in a single operation. If the destination exists, the operation will fail. Works across different directories and can be used for simple renaming within the same directory. Both source and destination must be within allowed directories.
Parameters|Type|Description
-|-|-
`destination`|`string`|
`source`|`string`|

---
#### Tool: **`read_file`**
Read the complete contents of a file from the file system. Handles various text encodings and provides detailed error messages if the file cannot be read. Use this tool when you need to examine the contents of a single file. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`read_multiple_files`**
Read the contents of multiple files simultaneously. This is more efficient than reading files one by one when you need to analyze or compare multiple files. Each file's content is returned with its path as a reference. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`paths`|`array`|

---
#### Tool: **`search_files`**
Recursively search for files and directories matching a pattern. Searches through all subdirectories from the starting path. The search is case-insensitive and matches partial names. Returns full paths to all matching items. Great for finding files when you don't know their exact location. Only searches within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|
`pattern`|`string`|
`excludePatterns`|`array` *optional*|

---
#### Tool: **`write_file`**
Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`content`|`string`|
`path`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/filesystem",
        "{{filesystem.paths|into}}"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

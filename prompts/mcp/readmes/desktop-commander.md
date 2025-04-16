# Desktop-commander MCP Server

Search, update, manage files and run terminal commands with AI

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[wonderwhy-er](https://github.com/wonderwhy-er)
**Repository**|https://github.com/wonderwhy-er/DesktopCommanderMCP
**Dockerfile**|https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_directory`|Create a new directory or ensure a directory exists.|
`edit_block`|Apply surgical text replacements to files.|
`execute_command`|Execute a terminal command with timeout.|
`force_terminate`|Force terminate a running terminal session.|
`get_config`|Get the complete server configuration as JSON.|
`get_file_info`|Retrieve detailed metadata about a file or directory including size, creation time, last modified time, permissions, and type.|
`kill_process`|Terminate a running process by PID.|
`list_directory`|Get a detailed listing of all files and directories in a specified path.|
`list_processes`|List all running processes.|
`list_sessions`|List all active terminal sessions.|
`move_file`|Move or rename files and directories.|
`read_file`|Read the complete contents of a file from the file system or a URL.|
`read_multiple_files`|Read the contents of multiple files simultaneously.|
`read_output`|Read new output from a running terminal session.|
`search_code`|Search for text/code patterns within file contents using ripgrep.|
`search_files`|Finds files by name using a case-insensitive substring matching.|
`set_config_value`|Set a specific configuration value by key.|
`write_file`|Completely replace file contents.|

---
## Tools Details

#### Tool: **`create_directory`**
Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`edit_block`**
Apply surgical text replacements to files. Best for small changes (<20% of file size). Call repeatedly to change multiple blocks. Will verify changes after application. Format:
filepath
<<<<<<< SEARCH
content to find
=======
new content
>>>>>>> REPLACE
Parameters|Type|Description
-|-|-
`blockContent`|`string`|

---
#### Tool: **`execute_command`**
Execute a terminal command with timeout. Command will continue running in background if it doesn't complete within timeout.
Parameters|Type|Description
-|-|-
`command`|`string`|
`shell`|`string` *optional*|
`timeout_ms`|`number` *optional*|

---
#### Tool: **`force_terminate`**
Force terminate a running terminal session.
Parameters|Type|Description
-|-|-
`pid`|`number`|

---
#### Tool: **`get_config`**
Get the complete server configuration as JSON. Config includes fields for: blockedCommands (array of blocked shell commands), defaultShell (shell to use for commands), allowedDirectories (paths the server can access).
#### Tool: **`get_file_info`**
Retrieve detailed metadata about a file or directory including size, creation time, last modified time, permissions, and type. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`kill_process`**
Terminate a running process by PID. Use with caution as this will forcefully terminate the specified process.
Parameters|Type|Description
-|-|-
`pid`|`number`|

---
#### Tool: **`list_directory`**
Get a detailed listing of all files and directories in a specified path. Results distinguish between files and directories with [FILE] and [DIR] prefixes. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`list_processes`**
List all running processes. Returns process information including PID, command name, CPU usage, and memory usage.
#### Tool: **`list_sessions`**
List all active terminal sessions.
#### Tool: **`move_file`**
Move or rename files and directories. Can move files between directories and rename them in a single operation. Both source and destination must be within allowed directories.
Parameters|Type|Description
-|-|-
`destination`|`string`|
`source`|`string`|

---
#### Tool: **`read_file`**
Read the complete contents of a file from the file system or a URL. When reading from the file system, only works within allowed directories. Can fetch content from URLs when isUrl parameter is set to true. Handles text files normally and image files are returned as viewable images. Recognized image types: PNG, JPEG, GIF, WebP.
Parameters|Type|Description
-|-|-
`path`|`string`|
`isUrl`|`boolean` *optional*|

---
#### Tool: **`read_multiple_files`**
Read the contents of multiple files simultaneously. Each file's content is returned with its path as a reference. Handles text files normally and renders images as viewable content. Recognized image types: PNG, JPEG, GIF, WebP. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`paths`|`array`|

---
#### Tool: **`read_output`**
Read new output from a running terminal session.
Parameters|Type|Description
-|-|-
`pid`|`number`|

---
#### Tool: **`search_code`**
Search for text/code patterns within file contents using ripgrep. Fast and powerful search similar to VS Code search functionality. Supports regular expressions, file pattern filtering, and context lines. Has a default timeout of 30 seconds which can be customized. Only searches within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|
`pattern`|`string`|
`contextLines`|`number` *optional*|
`filePattern`|`string` *optional*|
`ignoreCase`|`boolean` *optional*|
`includeHidden`|`boolean` *optional*|
`maxResults`|`number` *optional*|
`timeoutMs`|`number` *optional*|

---
#### Tool: **`search_files`**
Finds files by name using a case-insensitive substring matching. Searches through all subdirectories from the starting path. Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter. Only searches within allowed directories.
Parameters|Type|Description
-|-|-
`path`|`string`|
`pattern`|`string`|
`timeoutMs`|`number` *optional*|

---
#### Tool: **`set_config_value`**
Set a specific configuration value by key. WARNING: Should be used in a separate chat from file operations and command execution to prevent security issues. Config keys include: blockedCommands (array), defaultShell (string), allowedDirectories (array of paths). IMPORTANT: Setting allowedDirectories to an empty array ([]) allows full access to the entire file system, regardless of the operating system.
Parameters|Type|Description
-|-|-
`key`|`string`|
`value`|`string` *optional*|

---
#### Tool: **`write_file`**
Completely replace file contents. Best for large changes (>20% of file) or when edit_block fails. Use with caution as it will overwrite existing files. Only works within allowed directories.
Parameters|Type|Description
-|-|-
`content`|`string`|
`path`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "desktop-commander": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/desktop-commander"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

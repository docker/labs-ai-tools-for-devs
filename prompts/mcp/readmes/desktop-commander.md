# desktop-commander MCP Server

Search, update, manage files and run terminal commands with AI

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[wonderwhy-er](https://github.com/wonderwhy-er)
**Repository**|https://github.com/wonderwhy-er/DesktopCommanderMCP
**Dockerfile**|https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Summary
1. `block_command` Add a command to the blacklist.
1. `create_directory` Create a new directory or ensure a directory exists.
1. `edit_block` Apply surgical text replacements to files.
1. `execute_command` Execute a terminal command with timeout.
1. `force_terminate` Force terminate a running terminal session.
1. `get_file_info` Retrieve detailed metadata about a file or directory including size, creation time, last modified time, permissions, and type.
1. `kill_process` Terminate a running process by PID.
1. `list_allowed_directories` Returns the list of directories that this server is allowed to access.
1. `list_blocked_commands` List all currently blocked commands.
1. `list_directory` Get a detailed listing of all files and directories in a specified path.
1. `list_processes` List all running processes.
1. `list_sessions` List all active terminal sessions.
1. `move_file` Move or rename files and directories.
1. `read_file` Read the complete contents of a file from the file system or a URL.
1. `read_multiple_files` Read the contents of multiple files simultaneously.
1. `read_output` Read new output from a running terminal session.
1. `search_code` Search for text/code patterns within file contents using ripgrep.
1. `search_files` Finds files by name using a case-insensitive substring matching.
1. `unblock_command` Remove a command from the blacklist.
1. `write_file` Completely replace file contents.

## Tools

### Tool `block_command`
Add a command to the blacklist. Once blocked, the command cannot be executed until unblocked.

Parameter|Type|Description
-|-|-
`command`|`string`|

### Tool `create_directory`
Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. Only works within allowed directories.

Parameter|Type|Description
-|-|-
`path`|`string`|

### Tool `edit_block`
Apply surgical text replacements to files. Best for small changes (<20% of file size). Call repeatedly to change multiple blocks. Will verify changes after application. Format:
filepath
<<<<<<< SEARCH
content to find
=======
new content
>>>>>>> REPLACE

Parameter|Type|Description
-|-|-
`blockContent`|`string`|

### Tool `execute_command`
Execute a terminal command with timeout. Command will continue running in background if it doesn't complete within timeout.

Parameter|Type|Description
-|-|-
`command`|`string`|
`timeout_ms`|`number` *optional*|

### Tool `force_terminate`
Force terminate a running terminal session.

Parameter|Type|Description
-|-|-
`pid`|`number`|

### Tool `get_file_info`
Retrieve detailed metadata about a file or directory including size, creation time, last modified time, permissions, and type. Only works within allowed directories.

Parameter|Type|Description
-|-|-
`path`|`string`|

### Tool `kill_process`
Terminate a running process by PID. Use with caution as this will forcefully terminate the specified process.

Parameter|Type|Description
-|-|-
`pid`|`number`|

### Tool `list_allowed_directories`
Returns the list of directories that this server is allowed to access.

### Tool `list_blocked_commands`
List all currently blocked commands.

### Tool `list_directory`
Get a detailed listing of all files and directories in a specified path. Results distinguish between files and directories with [FILE] and [DIR] prefixes. Only works within allowed directories.

Parameter|Type|Description
-|-|-
`path`|`string`|

### Tool `list_processes`
List all running processes. Returns process information including PID, command name, CPU usage, and memory usage.

### Tool `list_sessions`
List all active terminal sessions.

### Tool `move_file`
Move or rename files and directories. Can move files between directories and rename them in a single operation. Both source and destination must be within allowed directories.

Parameter|Type|Description
-|-|-
`destination`|`string`|
`source`|`string`|

### Tool `read_file`
Read the complete contents of a file from the file system or a URL. When reading from the file system, only works within allowed directories. Can fetch content from URLs when isUrl parameter is set to true. Handles text files normally and image files are returned as viewable images. Recognized image types: PNG, JPEG, GIF, WebP.

Parameter|Type|Description
-|-|-
`path`|`string`|
`isUrl`|`boolean` *optional*|

### Tool `read_multiple_files`
Read the contents of multiple files simultaneously. Each file's content is returned with its path as a reference. Handles text files normally and renders images as viewable content. Recognized image types: PNG, JPEG, GIF, WebP. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.

Parameter|Type|Description
-|-|-
`paths`|`array`|

### Tool `read_output`
Read new output from a running terminal session.

Parameter|Type|Description
-|-|-
`pid`|`number`|

### Tool `search_code`
Search for text/code patterns within file contents using ripgrep. Fast and powerful search similar to VS Code search functionality. Supports regular expressions, file pattern filtering, and context lines. Has a default timeout of 30 seconds which can be customized. Only searches within allowed directories.

Parameter|Type|Description
-|-|-
`path`|`string`|
`pattern`|`string`|
`contextLines`|`number` *optional*|
`filePattern`|`string` *optional*|
`ignoreCase`|`boolean` *optional*|
`includeHidden`|`boolean` *optional*|
`maxResults`|`number` *optional*|
`timeoutMs`|`number` *optional*|

### Tool `search_files`
Finds files by name using a case-insensitive substring matching. Searches through all subdirectories from the starting path. Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter. Only searches within allowed directories.

Parameter|Type|Description
-|-|-
`path`|`string`|
`pattern`|`string`|
`timeoutMs`|`number` *optional*|

### Tool `unblock_command`
Remove a command from the blacklist. Once unblocked, the command can be executed normally.

Parameter|Type|Description
-|-|-
`command`|`string`|

### Tool `write_file`
Completely replace file contents. Best for large changes (>20% of file) or when edit_block fails. Use with caution as it will overwrite existing files. Only works within allowed directories.

Parameter|Type|Description
-|-|-
`content`|`string`|
`path`|`string`|

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

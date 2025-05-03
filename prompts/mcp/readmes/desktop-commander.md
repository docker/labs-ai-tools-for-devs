# Desktop Commander MCP Server

Search, update, manage files and run terminal commands with AI.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/desktop-commander](https://hub.docker.com/repository/docker/mcp/desktop-commander)
**Author**|[wonderwhy-er](https://github.com/wonderwhy-er)
**Repository**|https://github.com/wonderwhy-er/DesktopCommanderMCP
**Dockerfile**|https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/desktop-commander)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/desktop-commander --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_directory`|Create a new directory or ensure a directory exists.|
`edit_block`|Apply surgical text replacements to files.|
`execute_command`|Execute a terminal command with timeout.|
`force_terminate`|Force terminate a running terminal session.|
`get_config`|Get the complete server configuration as JSON.|
`get_file_info`|Retrieve detailed metadata about a file or directory including size, creation time, last modified time, 
                        permissions, and type.|
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
Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. Only works within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`edit_block`**
Apply surgical text replacements to files. 
                        BEST PRACTICE: Make multiple small, focused edits rather than one large edit. 
                        Each edit_block call should change only what needs to be changed - include just enough context to uniquely identify the text being modified. 
                        Takes file_path, old_string (text to replace), new_string (replacement text), and optional expected_replacements parameter. 
                        By default, replaces only ONE occurrence of the search text. 
                        To replace multiple occurrences, provide the expected_replacements parameter with the exact number of matches expected. 
                        UNIQUENESS REQUIREMENT: When expected_replacements=1 (default), include the minimal amount of context necessary (typically 1-3 lines) before and after the change point, with exact whitespace and indentation. 
                        When editing multiple sections, make separate edit_block calls for each distinct change rather than one large replacement. 
                        When a close but non-exact match is found, a character-level diff is shown in the format: common_prefix{-removed-}{+added+}common_suffix to help you identify what's different. 
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
Parameters|Type|Description
-|-|-
`file_path`|`string`|
`new_string`|`string`|
`old_string`|`string`|
`expected_replacements`|`number` *optional*|

---
#### Tool: **`execute_command`**
Execute a terminal command with timeout. 
                        Command will continue running in background if it doesn't complete within timeout. 
                        NOTE: For file operations, prefer specialized tools like read_file, search_code, list_directory instead of cat, grep, or ls commands.
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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
Retrieve detailed metadata about a file or directory including size, creation time, last modified time, 
                        permissions, and type. 
                        Only works within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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
Get a detailed listing of all files and directories in a specified path. Use this instead of 'execute_command' with ls/dir commands. Results distinguish between files and directories with [FILE] and [DIR] prefixes. Only works within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
Parameters|Type|Description
-|-|-
`path`|`string`|

---
#### Tool: **`list_processes`**
List all running processes. Returns process information including PID, command name, CPU usage, and memory usage.
#### Tool: **`list_sessions`**
List all active terminal sessions.
#### Tool: **`move_file`**
Move or rename files and directories. 
                        Can move files between directories and rename them in a single operation. 
                        Both source and destination must be within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
Parameters|Type|Description
-|-|-
`destination`|`string`|
`source`|`string`|

---
#### Tool: **`read_file`**
Read the complete contents of a file from the file system or a URL. Prefer this over 'execute_command' with cat/type for viewing files. When reading from the file system, only works within allowed directories. Can fetch content from URLs when isUrl parameter is set to true. Handles text files normally and image files are returned as viewable images. Recognized image types: PNG, JPEG, GIF, WebP. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
Parameters|Type|Description
-|-|-
`path`|`string`|
`isUrl`|`boolean` *optional*|

---
#### Tool: **`read_multiple_files`**
Read the contents of multiple files simultaneously. Each file's content is returned with its path as a reference. Handles text files normally and renders images as viewable content. Recognized image types: PNG, JPEG, GIF, WebP. Failed reads for individual files won't stop the entire operation. Only works within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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
Search for text/code patterns within file contents using ripgrep. 
                        Use this instead of 'execute_command' with grep/find for searching code content.
                        Fast and powerful search similar to VS Code search functionality. 
                        Supports regular expressions, file pattern filtering, and context lines. 
                        Has a default timeout of 30 seconds which can be customized. 
                        Only searches within allowed directories. 
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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
Finds files by name using a case-insensitive substring matching. 
                        Use this instead of 'execute_command' with find/dir/ls for locating files.
                        Searches through all subdirectories from the starting path. 
                        Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter. 
                        Only searches within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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
Completely replace file contents. Best for large changes (>20% of file) or when edit_block fails. Use with caution as it will overwrite existing files. Only works within allowed directories. IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
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

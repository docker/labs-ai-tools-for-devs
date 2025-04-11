# mark3labs-mcp-filesystem-server MCP Server

Go server implementing Model Context Protocol (MCP) for filesystem operations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [mark3labs](https://github.com/mark3labs) |
| **Repository** | https://github.com/mark3labs/mcp-filesystem-server |
| **Dockerfile** | https://github.com/mark3labs/mcp-filesystem-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create_directory`**: Create a new directory or ensure a directory exists.
 1. **`get_file_info`**: Retrieve detailed metadata about a file or directory.
 1. **`list_allowed_directories`**: Returns the list of directories that this server is allowed to access.
 1. **`list_directory`**: Get a detailed listing of all files and directories in a specified path.
 1. **`move_file`**: Move or rename files and directories.
 1. **`read_file`**: Read the complete contents of a file from the file system.
 1. **`search_files`**: Recursively search for files and directories matching a pattern.
 1. **`write_file`**: Create a new file or overwrite an existing file with new content.

## Tools

### Tool: **`create_directory`**

Create a new directory or ensure a directory exists.

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` | Path of the directory to create |

### Tool: **`get_file_info`**

Retrieve detailed metadata about a file or directory.

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` | Path to the file or directory |

### Tool: **`list_allowed_directories`**

Returns the list of directories that this server is allowed to access.

### Tool: **`list_directory`**

Get a detailed listing of all files and directories in a specified path.

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` | Path of the directory to list |

### Tool: **`move_file`**

Move or rename files and directories.

| Parameter | Type | Description |
| - | - | - |
| `destination` | `string` | Destination path |
| `source` | `string` | Source path of the file or directory |

### Tool: **`read_file`**

Read the complete contents of a file from the file system.

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` | Path to the file to read |

### Tool: **`search_files`**

Recursively search for files and directories matching a pattern.

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` | Starting path for the search |
| `pattern` | `string` | Search pattern to match against file names |

### Tool: **`write_file`**

Create a new file or overwrite an existing file with new content.

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` | Content to write to the file |
| `path` | `string` | Path where to write the file |

## Use this MCP Server

```json
{
  "mcpServers": {
    "mark3labs-mcp-filesystem-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/mark3labs-mcp-filesystem-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/mark3labs-mcp-filesystem-server -f Dockerfile https://github.com/mark3labs/mcp-filesystem-server.git
```


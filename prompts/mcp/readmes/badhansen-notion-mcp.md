# badhansen-notion-mcp MCP Server

A simple Model Context Protocol (MCP) server that integrates with Notion's API to manage my personal todo list.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [Badhansen](https://github.com/Badhansen) |
| **Repository** | https://github.com/Badhansen/notion-mcp |
| **Dockerfile** | https://github.com/Badhansen/notion-mcp/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add_todo`**: Add a new todo item
 1. **`complete_todo`**: Mark a todo item as completed.
 1. **`show_all_todos`**: Show all todo items from Notion.

## Tools

### Tool: **`add_todo`**

Add a new todo item

| Parameter | Type | Description |
| - | - | - |
| `task` | `string` | The todo task description |

### Tool: **`complete_todo`**

Mark a todo item as completed.

| Parameter | Type | Description |
| - | - | - |
| `task_id` | `string` | The task_id of the todo task to mark as complete. |

### Tool: **`show_all_todos`**

Show all todo items from Notion.

## Use this MCP Server

```json
{
  "mcpServers": {
    "badhansen-notion-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/badhansen-notion-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/badhansen-notion-mcp -f Dockerfile https://github.com/Badhansen/notion-mcp.git#master
```


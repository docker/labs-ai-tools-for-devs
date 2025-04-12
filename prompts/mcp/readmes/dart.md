# dart MCP Server

Dart AI Model Context Protocol (MCP) server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [its-dart](https://github.com/its-dart) |
| **Repository** | https://github.com/its-dart/dart-mcp-server |
| **Dockerfile** | https://github.com/its-dart/dart-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create_doc`**: Create a new doc in Dart. You can specify title, text content, and folder.
 1. **`create_task`**: Create a new task in Dart. You can specify title, description, status, priority, size, dates, dartboard, assignees, tags, and parent task.
 1. **`delete_doc`**: Move an existing doc to the trash, where it can be recovered if needed. Nothing else about the doc will be changed.
 1. **`delete_task`**: Move an existing task to the trash, where it can be recovered if needed. Nothing else about the task will be changed.
 1. **`get_config`**: Get information about the user's space, including all of the possible values that can be provided to other endpoints. This includes available assignees, dartboards, folders, statuses, tags, priorities, and sizes.
 1. **`get_doc`**: Retrieve an existing doc by its ID. Returns the doc's information including title, text content, folder, and more.
 1. **`get_task`**: Retrieve an existing task by its ID. Returns the task's information including title, description, status, priority, dates, and more.
 1. **`list_docs`**: List docs from Dart with optional filtering parameters. You can filter by folder, title, text content, and more.
 1. **`list_tasks`**: List tasks from Dart with optional filtering parameters. You can filter by assignee, status, dartboard, priority, due date, and more.
 1. **`update_doc`**: Update an existing doc. You can modify its title, text content, and folder.
 1. **`update_task`**: Update an existing task. You can modify any of its properties including title, description, status, priority, dates, assignees, and more.

## Tools

### Tool: **`create_doc`**

Create a new doc in Dart. You can specify title, text content, and folder.

| Parameter | Type | Description |
| - | - | - |
| `title` | `string` | The title of the doc (required) |
| `folder` | `string` *optional* | The title of the folder to place the doc in |
| `text` | `string` *optional* | The text content of the doc, which can include markdown formatting |

### Tool: **`create_task`**

Create a new task in Dart. You can specify title, description, status, priority, size, dates, dartboard, assignees, tags, and parent task.

| Parameter | Type | Description |
| - | - | - |
| `title` | `string` | The title of the task (required) |
| `assignee` | `string` *optional* | Single assignee name or email (if workspace doesn't allow multiple assignees) |
| `assignees` | `array` *optional* | Array of assignee names or emails (if workspace allows multiple assignees) |
| `dartboard` | `string` *optional* | The title of the dartboard (project or list of tasks) |
| `description` | `string` *optional* | A longer description of the task, which can include markdown formatting |
| `dueAt` | `string` *optional* | The due date in ISO format (should be at 9:00am in user's timezone) |
| `parentId` | `string` *optional* | The ID of the parent task |
| `priority` | `string` *optional* | The priority (Critical, High, Medium, or Low) |
| `size` | `number` *optional* | A number that represents the amount of work needed |
| `startAt` | `string` *optional* | The start date in ISO format (should be at 9:00am in user's timezone) |
| `status` | `string` *optional* | The status from the list of available statuses |
| `tags` | `array` *optional* | Array of tags to apply to the task |

### Tool: **`delete_doc`**

Move an existing doc to the trash, where it can be recovered if needed. Nothing else about the doc will be changed.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the doc |

### Tool: **`delete_task`**

Move an existing task to the trash, where it can be recovered if needed. Nothing else about the task will be changed.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the task |

### Tool: **`get_config`**

Get information about the user's space, including all of the possible values that can be provided to other endpoints. This includes available assignees, dartboards, folders, statuses, tags, priorities, and sizes.

### Tool: **`get_doc`**

Retrieve an existing doc by its ID. Returns the doc's information including title, text content, folder, and more.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the doc |

### Tool: **`get_task`**

Retrieve an existing task by its ID. Returns the task's information including title, description, status, priority, dates, and more.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the task |

### Tool: **`list_docs`**

List docs from Dart with optional filtering parameters. You can filter by folder, title, text content, and more.

| Parameter | Type | Description |
| - | - | - |
| `duids` | `string` *optional* | Filter by IDs |
| `folder` | `string` *optional* | Filter by folder title |
| `folder_duid` | `string` *optional* | Filter by folder ID |
| `in_trash` | `boolean` *optional* | Filter by trash status |
| `is_draft` | `boolean` *optional* | Filter by draft status |
| `limit` | `number` *optional* | Number of results per page |
| `offset` | `number` *optional* | Initial index for pagination |
| `s` | `string` *optional* | Search by title, text, or folder title |
| `text` | `string` *optional* | Filter by text content |
| `title` | `string` *optional* | Filter by title |

### Tool: **`list_tasks`**

List tasks from Dart with optional filtering parameters. You can filter by assignee, status, dartboard, priority, due date, and more.

| Parameter | Type | Description |
| - | - | - |
| `assignee` | `string` *optional* | Filter by assignee name or email |
| `assignee_duid` | `string` *optional* | Filter by assignee ID |
| `dartboard` | `string` *optional* | Filter by dartboard title |
| `dartboard_duid` | `string` *optional* | Filter by dartboard ID |
| `description` | `string` *optional* | Filter by description content |
| `due_at_after` | `string` *optional* | Filter by due date after (ISO format) |
| `due_at_before` | `string` *optional* | Filter by due date before (ISO format) |
| `duids` | `string` *optional* | Filter by IDs |
| `in_trash` | `boolean` *optional* | Filter by trash status |
| `is_draft` | `boolean` *optional* | Filter by draft status |
| `kind` | `string` *optional* | Filter by task kind |
| `limit` | `number` *optional* | Number of results per page |
| `offset` | `number` *optional* | Initial index for pagination |
| `priority` | `string` *optional* | Filter by priority |
| `size` | `number` *optional* | Filter by task size |
| `start_at_after` | `string` *optional* | Filter by start date after (ISO format) |
| `start_at_before` | `string` *optional* | Filter by start date before (ISO format) |
| `status` | `string` *optional* | Filter by status |
| `status_duid` | `string` *optional* | Filter by status ID |
| `subscriber_duid` | `string` *optional* | Filter by subscriber ID |
| `tag` | `string` *optional* | Filter by tag |
| `title` | `string` *optional* | Filter by title |

### Tool: **`update_doc`**

Update an existing doc. You can modify its title, text content, and folder.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the doc |
| `folder` | `string` *optional* | The title of the folder to place the doc in |
| `text` | `string` *optional* | The text content of the doc, which can include markdown formatting |
| `title` | `string` *optional* | The title of the doc |

### Tool: **`update_task`**

Update an existing task. You can modify any of its properties including title, description, status, priority, dates, assignees, and more.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The 12-character alphanumeric ID of the task |
| `assignee` | `string` *optional* | Single assignee name or email (if workspace doesn't allow multiple assignees) |
| `assignees` | `array` *optional* | Array of assignee names or emails (if workspace allows multiple assignees) |
| `dartboard` | `string` *optional* | The title of the dartboard (project or list of tasks) |
| `description` | `string` *optional* | A longer description of the task, which can include markdown formatting |
| `dueAt` | `string` *optional* | The due date in ISO format (should be at 9:00am in user's timezone) |
| `parentId` | `string` *optional* | The ID of the parent task |
| `priority` | `string` *optional* | The priority (Critical, High, Medium, or Low) |
| `size` | `number` *optional* | A number that represents the amount of work needed |
| `startAt` | `string` *optional* | The start date in ISO format (should be at 9:00am in user's timezone) |
| `status` | `string` *optional* | The status from the list of available statuses |
| `tags` | `array` *optional* | Array of tags to apply to the task |
| `title` | `string` *optional* | The title of the task |

## Use this MCP Server

```json
{
  "mcpServers": {
    "dart": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "DART_HOST"
        "-e"
        "DART_TOKEN"
        "mcp/dart"
      ],
      "env": {
        "DART_HOST": "https://app.itsdart.com",
        "DART_TOKEN": "dsa_..."
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/dart -f Dockerfile https://github.com/its-dart/dart-mcp-server.git
```


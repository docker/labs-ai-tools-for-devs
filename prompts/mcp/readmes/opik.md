# opik MCP Server

Model Context Protocol (MCP) implementation for Opik enabling seamless IDE integration and unified access to prompts, projects, traces, and metrics. 

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [comet-ml](https://github.com/comet-ml) |
| **Repository** | https://github.com/comet-ml/opik-mcp |
| **Dockerfile** | https://github.com/comet-ml/opik-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`create-project`**: Create a new project/workspace
 1. **`create-prompt`**: Create a new prompt
 1. **`create-prompt-version`**: Create a new version of a prompt
 1. **`delete-project`**: Delete a project
 1. **`delete-prompt`**: Delete a prompt
 1. **`get-metrics`**: Get metrics data
 1. **`get-opik-examples`**: Get examples of how to use Opik Comet's API for specific tasks
 1. **`get-opik-help`**: Get contextual help about Opik Comet's capabilities
 1. **`get-opik-tracing-info`**: Get information about Opik's tracing capabilities and how to use them
 1. **`get-project-by-id`**: Get a single project by ID
 1. **`get-prompt-by-id`**: Get a single prompt by ID
 1. **`get-server-info`**: Get information about the Opik server configuration
 1. **`get-trace-by-id`**: Get a single trace by ID
 1. **`get-trace-stats`**: Get statistics for traces
 1. **`list-projects`**: Get a list of projects/workspaces
 1. **`list-prompts`**: Get a list of Opik prompts
 1. **`list-traces`**: Get a list of traces
 1. **`update-project`**: Update a project
 1. **`update-prompt`**: Update a prompt

## Tools

### Tool: **`create-project`**

Create a new project/workspace

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the project |
| `description` | `string` *optional* | Description of the project |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`create-prompt`**

Create a new prompt

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the prompt |

### Tool: **`create-prompt-version`**

Create a new version of a prompt

| Parameter | Type | Description |
| - | - | - |
| `commit_message` | `string` | Commit message for the prompt version |
| `name` | `string` | Name of the original prompt |
| `template` | `string` | Template content for the prompt version |

### Tool: **`delete-project`**

Delete a project

| Parameter | Type | Description |
| - | - | - |
| `projectId` | `string` | ID of the project to delete |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`delete-prompt`**

Delete a prompt

| Parameter | Type | Description |
| - | - | - |
| `promptId` | `string` | ID of the prompt to delete |

### Tool: **`get-metrics`**

Get metrics data

| Parameter | Type | Description |
| - | - | - |
| `endDate` | `string` *optional* | End date in ISO format (YYYY-MM-DD) |
| `metricName` | `string` *optional* | Optional metric name to filter |
| `projectId` | `string` *optional* | Optional project ID to filter metrics |
| `projectName` | `string` *optional* | Optional project name to filter metrics |
| `startDate` | `string` *optional* | Start date in ISO format (YYYY-MM-DD) |

### Tool: **`get-opik-examples`**

Get examples of how to use Opik Comet's API for specific tasks

| Parameter | Type | Description |
| - | - | - |
| `task` | `string` | The task to get examples for (e.g., 'create prompt', 'analyze traces', 'monitor costs') |

### Tool: **`get-opik-help`**

Get contextual help about Opik Comet's capabilities

| Parameter | Type | Description |
| - | - | - |
| `topic` | `string` | The topic to get help about (prompts, projects, traces, metrics, or general) |
| `subtopic` | `string` *optional* | Optional subtopic for more specific help |

### Tool: **`get-opik-tracing-info`**

Get information about Opik's tracing capabilities and how to use them

| Parameter | Type | Description |
| - | - | - |
| `topic` | `string` *optional* | Optional specific tracing topic to get information about (e.g., 'spans', 'distributed', 'multimodal', 'annotations') |

### Tool: **`get-project-by-id`**

Get a single project by ID

| Parameter | Type | Description |
| - | - | - |
| `projectId` | `string` | ID of the project to fetch |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`get-prompt-by-id`**

Get a single prompt by ID

| Parameter | Type | Description |
| - | - | - |
| `promptId` | `string` | ID of the prompt to fetch |

### Tool: **`get-server-info`**

Get information about the Opik server configuration

| Parameter | Type | Description |
| - | - | - |
| `random_string` | `string` *optional* | Dummy parameter for no-parameter tools |

### Tool: **`get-trace-by-id`**

Get a single trace by ID

| Parameter | Type | Description |
| - | - | - |
| `traceId` | `string` | ID of the trace to fetch |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`get-trace-stats`**

Get statistics for traces

| Parameter | Type | Description |
| - | - | - |
| `endDate` | `string` *optional* | End date in ISO format (YYYY-MM-DD) |
| `projectId` | `string` *optional* | Project ID to filter traces |
| `projectName` | `string` *optional* | Project name to filter traces |
| `startDate` | `string` *optional* | Start date in ISO format (YYYY-MM-DD) |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`list-projects`**

Get a list of projects/workspaces

| Parameter | Type | Description |
| - | - | - |
| `page` | `number` | Page number for pagination |
| `size` | `number` | Number of items per page |
| `sortBy` | `string` *optional* | Sort projects by this field |
| `sortOrder` | `string` *optional* | Sort order (asc or desc) |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`list-prompts`**

Get a list of Opik prompts

| Parameter | Type | Description |
| - | - | - |
| `page` | `number` | Page number for pagination |
| `size` | `number` | Number of items per page |

### Tool: **`list-traces`**

Get a list of traces

| Parameter | Type | Description |
| - | - | - |
| `page` | `number` | Page number for pagination |
| `size` | `number` | Number of items per page |
| `projectId` | `string` *optional* | Project ID to filter traces |
| `projectName` | `string` *optional* | Project name to filter traces |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`update-project`**

Update a project

| Parameter | Type | Description |
| - | - | - |
| `projectId` | `string` | ID of the project to update |
| `description` | `string` *optional* | New project description |
| `name` | `string` *optional* | New project name |
| `workspaceName` | `string` *optional* | Workspace name to use instead of the default |

### Tool: **`update-prompt`**

Update a prompt

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | New name for the prompt |
| `promptId` | `string` | ID of the prompt to update |

## Use this MCP Server

```json
{
  "mcpServers": {
    "opik": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "OPIK_API_BASE_URL"
        "-e"
        "OPIK_WORKSPACE_NAME"
        "-e"
        "OPIK_API_KEY"
        "mcp/opik"
      ],
      "env": {
        "OPIK_API_BASE_URL": "https://www.comet.com/opik/api",
        "OPIK_WORKSPACE_NAME": "default",
        "OPIK_API_KEY": "your_api_key"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/opik -f Dockerfile https://github.com/comet-ml/opik-mcp.git
```


# maxteabag-githubworkflowmcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [Maxteabag](https://github.com/Maxteabag) |
| **Repository** | https://github.com/Maxteabag/GithubWorkflowMCP |
| **Dockerfile** | https://github.com/Maxteabag/GithubWorkflowMCP/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`analyze-workflow-failure`**: Analyze a failed workflow run and suggest fixes
 1. **`get-failed-workflow-runs`**: Get recent failed workflow runs for a GitHub repository
 1. **`get-workflow-file`**: Get the content of a workflow file
 1. **`get-workflow-run-jobs`**: Get jobs for a specific workflow run

## Tools

### Tool: **`analyze-workflow-failure`**

Analyze a failed workflow run and suggest fixes

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | GitHub repository owner (username or organization) |
| `repo` | `string` | GitHub repository name |
| `runId` | `number` | Workflow run ID |

### Tool: **`get-failed-workflow-runs`**

Get recent failed workflow runs for a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | GitHub repository owner (username or organization) |
| `repo` | `string` | GitHub repository name |

### Tool: **`get-workflow-file`**

Get the content of a workflow file

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | GitHub repository owner (username or organization) |
| `path` | `string` | Path to the workflow file (e.g., .github/workflows/main.yml) |
| `repo` | `string` | GitHub repository name |

### Tool: **`get-workflow-run-jobs`**

Get jobs for a specific workflow run

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | GitHub repository owner (username or organization) |
| `repo` | `string` | GitHub repository name |
| `runId` | `number` | Workflow run ID |

## Use this MCP Server

```json
{
  "mcpServers": {
    "maxteabag-githubworkflowmcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "GITHUB_PERSONAL_ACCESS_TOKEN"
        "mcpcommunity/maxteabag-githubworkflowmcp"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/maxteabag-githubworkflowmcp -f Dockerfile https://github.com/Maxteabag/GithubWorkflowMCP.git#master
```


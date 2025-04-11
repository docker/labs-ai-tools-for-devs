# dynamicendpoints-cloudflare-github-backup-mcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [DynamicEndpoints](https://github.com/DynamicEndpoints) |
| **Repository** | https://github.com/DynamicEndpoints/cloudflare-github-backup-mcp |
| **Dockerfile** | https://github.com/DynamicEndpoints/cloudflare-github-backup-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`backup_projects`**: Backup Cloudflare projects to GitHub
 1. **`list_backups`**: List available backups for a Cloudflare project
 1. **`restore_project`**: Restore a Cloudflare project from a backup

## Tools

### Tool: **`backup_projects`**

Backup Cloudflare projects to GitHub

| Parameter | Type | Description |
| - | - | - |
| `projectIds` | `array` *optional* | Optional array of Cloudflare project IDs to backup. If not provided, all projects will be backed up. |

### Tool: **`list_backups`**

List available backups for a Cloudflare project

| Parameter | Type | Description |
| - | - | - |
| `projectId` | `string` | ID of the Cloudflare project |

### Tool: **`restore_project`**

Restore a Cloudflare project from a backup

| Parameter | Type | Description |
| - | - | - |
| `projectId` | `string` | ID of the Cloudflare project to restore |
| `timestamp` | `string` *optional* | Optional timestamp of the backup to restore. If not provided, the most recent backup will be used. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "dynamicendpoints-cloudflare-github-backup-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "GITHUB_REPO_NAME"
        "-e"
        "GITHUB_USERNAME"
        "-e"
        "CLOUDFLARE_API_TOKEN"
        "-e"
        "GITHUB_ACCESS_TOKEN"
        "mcpcommunity/dynamicendpoints-cloudflare-github-backup-mcp"
      ],
      "env": {
        "GITHUB_REPO_NAME": "YOUR_GITHUB_REPO_NAME",
        "GITHUB_USERNAME": "YOUR_GITHUB_USERNAME",
        "CLOUDFLARE_API_TOKEN": "YOUR_CLOUDFLARE_API_TOKEN",
        "GITHUB_ACCESS_TOKEN": "YOUR_GITHUB_ACCESS_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/dynamicendpoints-cloudflare-github-backup-mcp -f Dockerfile https://github.com/DynamicEndpoints/cloudflare-github-backup-mcp.git
```


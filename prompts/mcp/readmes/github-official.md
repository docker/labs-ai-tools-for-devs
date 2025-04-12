# github-official MCP Server

Provides seamless integration with GitHub APIs, enabling advanced automation and interaction capabilities for developers and tools.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [github](https://github.com/github) |
| **Repository** | https://github.com/github/github-mcp-server |
| **Dockerfile** | https://github.com/github/github-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add_issue_comment`**: Add a comment to an existing issue
 1. **`create_branch`**: Create a new branch in a GitHub repository
 1. **`create_issue`**: Create a new issue in a GitHub repository
 1. **`create_or_update_file`**: Create or update a single file in a GitHub repository
 1. **`create_pull_request`**: Create a new pull request in a GitHub repository
 1. **`create_pull_request_review`**: Create a review on a pull request
 1. **`create_repository`**: Create a new GitHub repository in your account
 1. **`fork_repository`**: Fork a GitHub repository to your account or specified organization
 1. **`get_code_scanning_alert`**: Get details of a specific code scanning alert in a GitHub repository.
 1. **`get_file_contents`**: Get the contents of a file or directory from a GitHub repository
 1. **`get_issue`**: Get details of a specific issue in a GitHub repository.
 1. **`get_issue_comments`**: Get comments for a GitHub issue
 1. **`get_me`**: Get details of the authenticated GitHub user. Use this when a request include "me", "my"...
 1. **`get_pull_request`**: Get details of a specific pull request
 1. **`get_pull_request_comments`**: Get the review comments on a pull request
 1. **`get_pull_request_files`**: Get the list of files changed in a pull request
 1. **`get_pull_request_reviews`**: Get the reviews on a pull request
 1. **`get_pull_request_status`**: Get the combined status of all status checks for a pull request
 1. **`list_code_scanning_alerts`**: List code scanning alerts in a GitHub repository.
 1. **`list_commits`**: Get list of commits of a branch in a GitHub repository
 1. **`list_issues`**: List issues in a GitHub repository with filtering options
 1. **`list_pull_requests`**: List and filter repository pull requests
 1. **`merge_pull_request`**: Merge a pull request
 1. **`push_files`**: Push multiple files to a GitHub repository in a single commit
 1. **`search_code`**: Search for code across GitHub repositories
 1. **`search_issues`**: Search for issues and pull requests across GitHub repositories
 1. **`search_repositories`**: Search for GitHub repositories
 1. **`search_users`**: Search for GitHub users
 1. **`update_issue`**: Update an existing issue in a GitHub repository
 1. **`update_pull_request_branch`**: Update a pull request branch with the latest changes from the base branch

## Tools

### Tool: **`add_issue_comment`**

Add a comment to an existing issue

| Parameter | Type | Description |
| - | - | - |
| `body` | `string` | Comment text |
| `issue_number` | `number` | Issue number to comment on |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |

### Tool: **`create_branch`**

Create a new branch in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `branch` | `string` | Name for new branch |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `from_branch` | `string` *optional* | Source branch (defaults to repo default) |

### Tool: **`create_issue`**

Create a new issue in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `title` | `string` | Issue title |
| `assignees` | `array` *optional* | Usernames to assign to this issue |
| `body` | `string` *optional* | Issue body content |
| `labels` | `array` *optional* | Labels to apply to this issue |
| `milestone` | `number` *optional* | Milestone number |

### Tool: **`create_or_update_file`**

Create or update a single file in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `branch` | `string` | Branch to create/update the file in |
| `content` | `string` | Content of the file |
| `message` | `string` | Commit message |
| `owner` | `string` | Repository owner (username or organization) |
| `path` | `string` | Path where to create/update the file |
| `repo` | `string` | Repository name |
| `sha` | `string` *optional* | SHA of file being replaced (for updates) |

### Tool: **`create_pull_request`**

Create a new pull request in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `base` | `string` | Branch to merge into |
| `head` | `string` | Branch containing changes |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `title` | `string` | PR title |
| `body` | `string` *optional* | PR description |
| `draft` | `boolean` *optional* | Create as draft PR |
| `maintainer_can_modify` | `boolean` *optional* | Allow maintainer edits |

### Tool: **`create_pull_request_review`**

Create a review on a pull request

| Parameter | Type | Description |
| - | - | - |
| `event` | `string` | Review action ('APPROVE', 'REQUEST_CHANGES', 'COMMENT') |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |
| `body` | `string` *optional* | Review comment text |
| `comments` | `array` *optional* | Line-specific comments array of objects to place comments on pull request changes. Requires path and body. For line comments use line or position. For multi-line comments use start_line and line with optional side parameters. |
| `commitId` | `string` *optional* | SHA of commit to review |

### Tool: **`create_repository`**

Create a new GitHub repository in your account

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Repository name |
| `autoInit` | `boolean` *optional* | Initialize with README |
| `description` | `string` *optional* | Repository description |
| `private` | `boolean` *optional* | Whether repo should be private |

### Tool: **`fork_repository`**

Fork a GitHub repository to your account or specified organization

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `organization` | `string` *optional* | Organization to fork to |

### Tool: **`get_code_scanning_alert`**

Get details of a specific code scanning alert in a GitHub repository.

| Parameter | Type | Description |
| - | - | - |
| `alertNumber` | `number` | The number of the alert. |
| `owner` | `string` | The owner of the repository. |
| `repo` | `string` | The name of the repository. |

### Tool: **`get_file_contents`**

Get the contents of a file or directory from a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner (username or organization) |
| `path` | `string` | Path to file/directory |
| `repo` | `string` | Repository name |
| `branch` | `string` *optional* | Branch to get contents from |

### Tool: **`get_issue`**

Get details of a specific issue in a GitHub repository.

| Parameter | Type | Description |
| - | - | - |
| `issue_number` | `number` | The number of the issue. |
| `owner` | `string` | The owner of the repository. |
| `repo` | `string` | The name of the repository. |

### Tool: **`get_issue_comments`**

Get comments for a GitHub issue

| Parameter | Type | Description |
| - | - | - |
| `issue_number` | `number` | Issue number |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `page` | `number` *optional* | Page number |
| `per_page` | `number` *optional* | Number of records per page |

### Tool: **`get_me`**

Get details of the authenticated GitHub user. Use this when a request include "me", "my"...

| Parameter | Type | Description |
| - | - | - |
| `reason` | `string` *optional* | Optional: reason the session was created |

### Tool: **`get_pull_request`**

Get details of a specific pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |

### Tool: **`get_pull_request_comments`**

Get the review comments on a pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |

### Tool: **`get_pull_request_files`**

Get the list of files changed in a pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |

### Tool: **`get_pull_request_reviews`**

Get the reviews on a pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |

### Tool: **`get_pull_request_status`**

Get the combined status of all status checks for a pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |

### Tool: **`list_code_scanning_alerts`**

List code scanning alerts in a GitHub repository.

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | The owner of the repository. |
| `repo` | `string` | The name of the repository. |
| `ref` | `string` *optional* | The Git reference for the results you want to list. |
| `severity` | `string` *optional* | Only code scanning alerts with this severity will be returned. Possible values are: critical, high, medium, low, warning, note, error. |
| `state` | `string` *optional* | State of the code scanning alerts to list. Set to closed to list only closed code scanning alerts. Default: open |

### Tool: **`list_commits`**

Get list of commits of a branch in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `sha` | `string` *optional* | Branch name |

### Tool: **`list_issues`**

List issues in a GitHub repository with filtering options

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `direction` | `string` *optional* | Sort direction ('asc', 'desc') |
| `labels` | `array` *optional* | Filter by labels |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `since` | `string` *optional* | Filter by date (ISO 8601 timestamp) |
| `sort` | `string` *optional* | Sort by ('created', 'updated', 'comments') |
| `state` | `string` *optional* | Filter by state ('open', 'closed', 'all') |

### Tool: **`list_pull_requests`**

List and filter repository pull requests

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `base` | `string` *optional* | Filter by base branch |
| `direction` | `string` *optional* | Sort direction ('asc', 'desc') |
| `head` | `string` *optional* | Filter by head user/org and branch |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `sort` | `string` *optional* | Sort by ('created', 'updated', 'popularity', 'long-running') |
| `state` | `string` *optional* | Filter by state ('open', 'closed', 'all') |

### Tool: **`merge_pull_request`**

Merge a pull request

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |
| `commit_message` | `string` *optional* | Extra detail for merge commit |
| `commit_title` | `string` *optional* | Title for merge commit |
| `merge_method` | `string` *optional* | Merge method ('merge', 'squash', 'rebase') |

### Tool: **`push_files`**

Push multiple files to a GitHub repository in a single commit

| Parameter | Type | Description |
| - | - | - |
| `branch` | `string` | Branch to push to |
| `files` | `array` | Array of file objects to push, each object with path (string) and content (string) |
| `message` | `string` | Commit message |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |

### Tool: **`search_code`**

Search for code across GitHub repositories

| Parameter | Type | Description |
| - | - | - |
| `q` | `string` | Search query using GitHub code search syntax |
| `order` | `string` *optional* | Sort order ('asc' or 'desc') |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `sort` | `string` *optional* | Sort field ('indexed' only) |

### Tool: **`search_issues`**

Search for issues and pull requests across GitHub repositories

| Parameter | Type | Description |
| - | - | - |
| `q` | `string` | Search query using GitHub issues search syntax |
| `order` | `string` *optional* | Sort order ('asc' or 'desc') |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `sort` | `string` *optional* | Sort field (comments, reactions, created, etc.) |

### Tool: **`search_repositories`**

Search for GitHub repositories

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |

### Tool: **`search_users`**

Search for GitHub users

| Parameter | Type | Description |
| - | - | - |
| `q` | `string` | Search query using GitHub users search syntax |
| `order` | `string` *optional* | Sort order ('asc' or 'desc') |
| `page` | `number` *optional* | Page number for pagination (min 1) |
| `perPage` | `number` *optional* | Results per page for pagination (min 1, max 100) |
| `sort` | `string` *optional* | Sort field (followers, repositories, joined) |

### Tool: **`update_issue`**

Update an existing issue in a GitHub repository

| Parameter | Type | Description |
| - | - | - |
| `issue_number` | `number` | Issue number to update |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `assignees` | `array` *optional* | New assignees |
| `body` | `string` *optional* | New description |
| `labels` | `array` *optional* | New labels |
| `milestone` | `number` *optional* | New milestone number |
| `state` | `string` *optional* | New state ('open' or 'closed') |
| `title` | `string` *optional* | New title |

### Tool: **`update_pull_request_branch`**

Update a pull request branch with the latest changes from the base branch

| Parameter | Type | Description |
| - | - | - |
| `owner` | `string` | Repository owner |
| `pullNumber` | `number` | Pull request number |
| `repo` | `string` | Repository name |
| `expectedHeadSha` | `string` *optional* | The expected SHA of the pull request's HEAD ref |

## Use this MCP Server

```json
{
  "mcpServers": {
    "github-official": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "GITHUB_PERSONAL_ACCESS_TOKEN"
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t ghcr.io/github/github-mcp-server -f Dockerfile https://github.com/github/github-mcp-server.git
```


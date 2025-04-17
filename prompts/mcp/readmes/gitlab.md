# Gitlab MCP Server

MCP Server for the GitLab API, enabling project management, file operations, and more.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/gitlab/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/gitlab)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_branch`|Create a new branch in a GitLab project|
`create_issue`|Create a new issue in a GitLab project|
`create_merge_request`|Create a new merge request in a GitLab project|
`create_or_update_file`|Create or update a single file in a GitLab project|
`create_repository`|Create a new GitLab project|
`fork_repository`|Fork a GitLab project to your account or specified namespace|
`get_file_contents`|Get the contents of a file or directory from a GitLab project|
`push_files`|Push multiple files to a GitLab project in a single commit|
`search_repositories`|Search for GitLab projects|

---
## Tools Details

#### Tool: **`create_branch`**
Create a new branch in a GitLab project
Parameters|Type|Description
-|-|-
`branch`|`string`|Name for the new branch
`project_id`|`string`|Project ID or URL-encoded path
`ref`|`string` *optional*|Source branch/commit for new branch

---
#### Tool: **`create_issue`**
Create a new issue in a GitLab project
Parameters|Type|Description
-|-|-
`project_id`|`string`|Project ID or URL-encoded path
`title`|`string`|Issue title
`assignee_ids`|`array` *optional*|Array of user IDs to assign
`description`|`string` *optional*|Issue description
`labels`|`array` *optional*|Array of label names
`milestone_id`|`number` *optional*|Milestone ID to assign

---
#### Tool: **`create_merge_request`**
Create a new merge request in a GitLab project
Parameters|Type|Description
-|-|-
`project_id`|`string`|Project ID or URL-encoded path
`source_branch`|`string`|Branch containing changes
`target_branch`|`string`|Branch to merge into
`title`|`string`|Merge request title
`allow_collaboration`|`boolean` *optional*|Allow commits from upstream members
`description`|`string` *optional*|Merge request description
`draft`|`boolean` *optional*|Create as draft merge request

---
#### Tool: **`create_or_update_file`**
Create or update a single file in a GitLab project
Parameters|Type|Description
-|-|-
`branch`|`string`|Branch to create/update the file in
`commit_message`|`string`|Commit message
`content`|`string`|Content of the file
`file_path`|`string`|Path where to create/update the file
`project_id`|`string`|Project ID or URL-encoded path
`previous_path`|`string` *optional*|Path of the file to move/rename

---
#### Tool: **`create_repository`**
Create a new GitLab project
Parameters|Type|Description
-|-|-
`name`|`string`|Repository name
`description`|`string` *optional*|Repository description
`initialize_with_readme`|`boolean` *optional*|Initialize with README.md
`visibility`|`string` *optional*|Repository visibility level

---
#### Tool: **`fork_repository`**
Fork a GitLab project to your account or specified namespace
Parameters|Type|Description
-|-|-
`project_id`|`string`|Project ID or URL-encoded path
`namespace`|`string` *optional*|Namespace to fork to (full path)

---
#### Tool: **`get_file_contents`**
Get the contents of a file or directory from a GitLab project
Parameters|Type|Description
-|-|-
`file_path`|`string`|Path to the file or directory
`project_id`|`string`|Project ID or URL-encoded path
`ref`|`string` *optional*|Branch/tag/commit to get contents from

---
#### Tool: **`push_files`**
Push multiple files to a GitLab project in a single commit
Parameters|Type|Description
-|-|-
`branch`|`string`|Branch to push to
`commit_message`|`string`|Commit message
`files`|`array`|Array of files to push
`project_id`|`string`|Project ID or URL-encoded path

---
#### Tool: **`search_repositories`**
Search for GitLab projects
Parameters|Type|Description
-|-|-
`search`|`string`|Search query
`page`|`number` *optional*|Page number for pagination (default: 1)
`per_page`|`number` *optional*|Number of results per page (default: 20)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITLAB_API_URL",
        "-e",
        "GITLAB_PERSONAL_ACCESS_TOKEN",
        "mcp/gitlab"
      ],
      "env": {
        "GITLAB_API_URL": "https://gitlab.com/api/v4",
        "GITLAB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

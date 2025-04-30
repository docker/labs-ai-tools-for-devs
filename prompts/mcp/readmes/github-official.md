# GitHub Official MCP Server

Official GitHub MCP Server, by GitHub. Provides seamless integration with GitHub APIs, enabling advanced automation and interaction capabilities for developers and tools.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/github-mcp-server](https://hub.docker.com/repository/docker/mcp/github-mcp-server)
**Author**|[github](https://github.com/github)
**Repository**|https://github.com/github/github-mcp-server
**Dockerfile**|https://github.com/docker/labs-ai-tools-for-devs/blob/main/functions/github-mcp-server/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/github-mcp-server)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`add_issue_comment`|Add a comment to an existing issue|
`add_pull_request_review_comment`|Add a review comment to a pull request|
`create_branch`|Create a new branch in a GitHub repository|
`create_issue`|Create a new issue in a GitHub repository|
`create_or_update_file`|Create or update a single file in a GitHub repository|
`create_pull_request`|Create a new pull request in a GitHub repository|
`create_pull_request_review`|Create a review on a pull request|
`create_repository`|Create a new GitHub repository in your account|
`fork_repository`|Fork a GitHub repository to your account or specified organization|
`get_code_scanning_alert`|Get details of a specific code scanning alert in a GitHub repository.|
`get_commit`|Get details for a commit from a GitHub repository|
`get_file_contents`|Get the contents of a file or directory from a GitHub repository|
`get_issue`|Get details of a specific issue in a GitHub repository|
`get_issue_comments`|Get comments for a GitHub issue|
`get_me`|Get details of the authenticated GitHub user.|
`get_pull_request`|Get details of a specific pull request|
`get_pull_request_comments`|Get the review comments on a pull request|
`get_pull_request_files`|Get the list of files changed in a pull request|
`get_pull_request_reviews`|Get the reviews on a pull request|
`get_pull_request_status`|Get the combined status of all status checks for a pull request|
`get_secret_scanning_alert`|Get details of a specific secret scanning alert in a GitHub repository.|
`list_branches`|List branches in a GitHub repository|
`list_code_scanning_alerts`|List code scanning alerts in a GitHub repository.|
`list_commits`|Get list of commits of a branch in a GitHub repository|
`list_issues`|List issues in a GitHub repository with filtering options|
`list_pull_requests`|List and filter repository pull requests|
`list_secret_scanning_alerts`|List secret scanning alerts in a GitHub repository.|
`merge_pull_request`|Merge a pull request|
`push_files`|Push multiple files to a GitHub repository in a single commit|
`search_code`|Search for code across GitHub repositories|
`search_issues`|Search for issues and pull requests across GitHub repositories|
`search_repositories`|Search for GitHub repositories|
`search_users`|Search for GitHub users|
`update_issue`|Update an existing issue in a GitHub repository|
`update_pull_request`|Update an existing pull request in a GitHub repository|
`update_pull_request_branch`|Update a pull request branch with the latest changes from the base branch|

---
## Tools Details

#### Tool: **`add_issue_comment`**
Add a comment to an existing issue
Parameters|Type|Description
-|-|-
`body`|`string`|Comment content
`issue_number`|`number`|Issue number to comment on
`owner`|`string`|Repository owner
`repo`|`string`|Repository name

---
#### Tool: **`add_pull_request_review_comment`**
Add a review comment to a pull request
Parameters|Type|Description
-|-|-
`body`|`string`|The text of the review comment
`owner`|`string`|Repository owner
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name
`commit_id`|`string` *optional*|The SHA of the commit to comment on. Required unless in_reply_to is specified.
`in_reply_to`|`number` *optional*|The ID of the review comment to reply to. When specified, only body is required and all other parameters are ignored
`line`|`number` *optional*|The line of the blob in the pull request diff that the comment applies to. For multi-line comments, the last line of the range
`path`|`string` *optional*|The relative path to the file that necessitates a comment. Required unless in_reply_to is specified.
`side`|`string` *optional*|The side of the diff to comment on
`start_line`|`number` *optional*|For multi-line comments, the first line of the range that the comment applies to
`start_side`|`string` *optional*|For multi-line comments, the starting side of the diff that the comment applies to
`subject_type`|`string` *optional*|The level at which the comment is targeted

---
#### Tool: **`create_branch`**
Create a new branch in a GitHub repository
Parameters|Type|Description
-|-|-
`branch`|`string`|Name for new branch
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`from_branch`|`string` *optional*|Source branch (defaults to repo default)

---
#### Tool: **`create_issue`**
Create a new issue in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`title`|`string`|Issue title
`assignees`|`array` *optional*|Usernames to assign to this issue
`body`|`string` *optional*|Issue body content
`labels`|`array` *optional*|Labels to apply to this issue
`milestone`|`number` *optional*|Milestone number

---
#### Tool: **`create_or_update_file`**
Create or update a single file in a GitHub repository
Parameters|Type|Description
-|-|-
`branch`|`string`|Branch to create/update the file in
`content`|`string`|Content of the file
`message`|`string`|Commit message
`owner`|`string`|Repository owner (username or organization)
`path`|`string`|Path where to create/update the file
`repo`|`string`|Repository name
`sha`|`string` *optional*|SHA of file being replaced (for updates)

---
#### Tool: **`create_pull_request`**
Create a new pull request in a GitHub repository
Parameters|Type|Description
-|-|-
`base`|`string`|Branch to merge into
`head`|`string`|Branch containing changes
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`title`|`string`|PR title
`body`|`string` *optional*|PR description
`draft`|`boolean` *optional*|Create as draft PR
`maintainer_can_modify`|`boolean` *optional*|Allow maintainer edits

---
#### Tool: **`create_pull_request_review`**
Create a review on a pull request
Parameters|Type|Description
-|-|-
`event`|`string`|Review action to perform
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name
`body`|`string` *optional*|Review comment text
`comments`|`array` *optional*|Line-specific comments array of objects to place comments on pull request changes. Requires path and body. For line comments use line or position. For multi-line comments use start_line and line with optional side parameters.
`commitId`|`string` *optional*|SHA of commit to review

---
#### Tool: **`create_repository`**
Create a new GitHub repository in your account
Parameters|Type|Description
-|-|-
`name`|`string`|Repository name
`autoInit`|`boolean` *optional*|Initialize with README
`description`|`string` *optional*|Repository description
`private`|`boolean` *optional*|Whether repo should be private

---
#### Tool: **`fork_repository`**
Fork a GitHub repository to your account or specified organization
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`organization`|`string` *optional*|Organization to fork to

---
#### Tool: **`get_code_scanning_alert`**
Get details of a specific code scanning alert in a GitHub repository.
Parameters|Type|Description
-|-|-
`alertNumber`|`number`|The number of the alert.
`owner`|`string`|The owner of the repository.
`repo`|`string`|The name of the repository.

---
#### Tool: **`get_commit`**
Get details for a commit from a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`sha`|`string`|Commit SHA, branch name, or tag name
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)

---
#### Tool: **`get_file_contents`**
Get the contents of a file or directory from a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`path`|`string`|Path to file/directory
`repo`|`string`|Repository name
`branch`|`string` *optional*|Branch to get contents from

---
#### Tool: **`get_issue`**
Get details of a specific issue in a GitHub repository
Parameters|Type|Description
-|-|-
`issue_number`|`number`|The number of the issue
`owner`|`string`|The owner of the repository
`repo`|`string`|The name of the repository

---
#### Tool: **`get_issue_comments`**
Get comments for a GitHub issue
Parameters|Type|Description
-|-|-
`issue_number`|`number`|Issue number
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`page`|`number` *optional*|Page number
`per_page`|`number` *optional*|Number of records per page

---
#### Tool: **`get_me`**
Get details of the authenticated GitHub user. Use this when a request include "me", "my"...
Parameters|Type|Description
-|-|-
`reason`|`string` *optional*|Optional: reason the session was created

---
#### Tool: **`get_pull_request`**
Get details of a specific pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_comments`**
Get the review comments on a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_files`**
Get the list of files changed in a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_reviews`**
Get the reviews on a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_status`**
Get the combined status of all status checks for a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_secret_scanning_alert`**
Get details of a specific secret scanning alert in a GitHub repository.
Parameters|Type|Description
-|-|-
`alertNumber`|`number`|The number of the alert.
`owner`|`string`|The owner of the repository.
`repo`|`string`|The name of the repository.

---
#### Tool: **`list_branches`**
List branches in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)

---
#### Tool: **`list_code_scanning_alerts`**
List code scanning alerts in a GitHub repository.
Parameters|Type|Description
-|-|-
`owner`|`string`|The owner of the repository.
`repo`|`string`|The name of the repository.
`ref`|`string` *optional*|The Git reference for the results you want to list.
`severity`|`string` *optional*|Filter code scanning alerts by severity
`state`|`string` *optional*|Filter code scanning alerts by state. Defaults to open
`tool_name`|`string` *optional*|The name of the tool used for code scanning.

---
#### Tool: **`list_commits`**
Get list of commits of a branch in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`sha`|`string` *optional*|SHA or Branch name

---
#### Tool: **`list_issues`**
List issues in a GitHub repository with filtering options
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`direction`|`string` *optional*|Sort direction
`labels`|`array` *optional*|Filter by labels
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`since`|`string` *optional*|Filter by date (ISO 8601 timestamp)
`sort`|`string` *optional*|Sort order
`state`|`string` *optional*|Filter by state

---
#### Tool: **`list_pull_requests`**
List and filter repository pull requests
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`base`|`string` *optional*|Filter by base branch
`direction`|`string` *optional*|Sort direction
`head`|`string` *optional*|Filter by head user/org and branch
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`sort`|`string` *optional*|Sort by
`state`|`string` *optional*|Filter by state

---
#### Tool: **`list_secret_scanning_alerts`**
List secret scanning alerts in a GitHub repository.
Parameters|Type|Description
-|-|-
`owner`|`string`|The owner of the repository.
`repo`|`string`|The name of the repository.
`resolution`|`string` *optional*|Filter by resolution
`secret_type`|`string` *optional*|A comma-separated list of secret types to return. All default secret patterns are returned. To return generic patterns, pass the token name(s) in the parameter.
`state`|`string` *optional*|Filter by state

---
#### Tool: **`merge_pull_request`**
Merge a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name
`commit_message`|`string` *optional*|Extra detail for merge commit
`commit_title`|`string` *optional*|Title for merge commit
`merge_method`|`string` *optional*|Merge method

---
#### Tool: **`push_files`**
Push multiple files to a GitHub repository in a single commit
Parameters|Type|Description
-|-|-
`branch`|`string`|Branch to push to
`files`|`array`|Array of file objects to push, each object with path (string) and content (string)
`message`|`string`|Commit message
`owner`|`string`|Repository owner
`repo`|`string`|Repository name

---
#### Tool: **`search_code`**
Search for code across GitHub repositories
Parameters|Type|Description
-|-|-
`q`|`string`|Search query using GitHub code search syntax
`order`|`string` *optional*|Sort order
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`sort`|`string` *optional*|Sort field ('indexed' only)

---
#### Tool: **`search_issues`**
Search for issues and pull requests across GitHub repositories
Parameters|Type|Description
-|-|-
`q`|`string`|Search query using GitHub issues search syntax
`order`|`string` *optional*|Sort order
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`sort`|`string` *optional*|Sort field by number of matches of categories, defaults to best match

---
#### Tool: **`search_repositories`**
Search for GitHub repositories
Parameters|Type|Description
-|-|-
`query`|`string`|Search query
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)

---
#### Tool: **`search_users`**
Search for GitHub users
Parameters|Type|Description
-|-|-
`q`|`string`|Search query using GitHub users search syntax
`order`|`string` *optional*|Sort order
`page`|`number` *optional*|Page number for pagination (min 1)
`perPage`|`number` *optional*|Results per page for pagination (min 1, max 100)
`sort`|`string` *optional*|Sort field by category

---
#### Tool: **`update_issue`**
Update an existing issue in a GitHub repository
Parameters|Type|Description
-|-|-
`issue_number`|`number`|Issue number to update
`owner`|`string`|Repository owner
`repo`|`string`|Repository name
`assignees`|`array` *optional*|New assignees
`body`|`string` *optional*|New description
`labels`|`array` *optional*|New labels
`milestone`|`number` *optional*|New milestone number
`state`|`string` *optional*|New state
`title`|`string` *optional*|New title

---
#### Tool: **`update_pull_request`**
Update an existing pull request in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number to update
`repo`|`string`|Repository name
`base`|`string` *optional*|New base branch name
`body`|`string` *optional*|New description
`maintainer_can_modify`|`boolean` *optional*|Allow maintainer edits
`state`|`string` *optional*|New state
`title`|`string` *optional*|New title

---
#### Tool: **`update_pull_request_branch`**
Update a pull request branch with the latest changes from the base branch
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner
`pullNumber`|`number`|Pull request number
`repo`|`string`|Repository name
`expectedHeadSha`|`string` *optional*|The expected SHA of the pull request's HEAD ref

---
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
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

# Github MCP Server

Tools for interacting with the GitHub API, enabling file operations, repository management, search functionality, and more.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/github/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/github)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`add_issue_comment`|Add a comment to an existing issue|
`create_branch`|Create a new branch in a GitHub repository|
`create_issue`|Create a new issue in a GitHub repository|
`create_or_update_file`|Create or update a single file in a GitHub repository|
`create_pull_request`|Create a new pull request in a GitHub repository|
`create_pull_request_review`|Create a review on a pull request|
`create_repository`|Create a new GitHub repository in your account|
`fork_repository`|Fork a GitHub repository to your account or specified organization|
`get_file_contents`|Get the contents of a file or directory from a GitHub repository|
`get_issue`|Get details of a specific issue in a GitHub repository.|
`get_pull_request`|Get details of a specific pull request|
`get_pull_request_comments`|Get the review comments on a pull request|
`get_pull_request_files`|Get the list of files changed in a pull request|
`get_pull_request_reviews`|Get the reviews on a pull request|
`get_pull_request_status`|Get the combined status of all status checks for a pull request|
`list_commits`|Get list of commits of a branch in a GitHub repository|
`list_issues`|List issues in a GitHub repository with filtering options|
`list_pull_requests`|List and filter repository pull requests|
`merge_pull_request`|Merge a pull request|
`push_files`|Push multiple files to a GitHub repository in a single commit|
`search_code`|Search for code across GitHub repositories|
`search_issues`|Search for issues and pull requests across GitHub repositories|
`search_repositories`|Search for GitHub repositories|
`search_users`|Search for users on GitHub|
`update_issue`|Update an existing issue in a GitHub repository|
`update_pull_request_branch`|Update a pull request branch with the latest changes from the base branch|

---
## Tools Details

#### Tool: **`add_issue_comment`**
Add a comment to an existing issue
Parameters|Type|Description
-|-|-
`body`|`string`|
`issue_number`|`number`|
`owner`|`string`|
`repo`|`string`|

---
#### Tool: **`create_branch`**
Create a new branch in a GitHub repository
Parameters|Type|Description
-|-|-
`branch`|`string`|Name for the new branch
`owner`|`string`|Repository owner (username or organization)
`repo`|`string`|Repository name
`from_branch`|`string` *optional*|Optional: source branch to create from (defaults to the repository's default branch)

---
#### Tool: **`create_issue`**
Create a new issue in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|
`repo`|`string`|
`title`|`string`|
`assignees`|`array` *optional*|
`body`|`string` *optional*|
`labels`|`array` *optional*|
`milestone`|`number` *optional*|

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
`sha`|`string` *optional*|SHA of the file being replaced (required when updating existing files)

---
#### Tool: **`create_pull_request`**
Create a new pull request in a GitHub repository
Parameters|Type|Description
-|-|-
`base`|`string`|The name of the branch you want the changes pulled into
`head`|`string`|The name of the branch where your changes are implemented
`owner`|`string`|Repository owner (username or organization)
`repo`|`string`|Repository name
`title`|`string`|Pull request title
`body`|`string` *optional*|Pull request body/description
`draft`|`boolean` *optional*|Whether to create the pull request as a draft
`maintainer_can_modify`|`boolean` *optional*|Whether maintainers can modify the pull request

---
#### Tool: **`create_pull_request_review`**
Create a review on a pull request
Parameters|Type|Description
-|-|-
`body`|`string`|The body text of the review
`event`|`string`|The review action to perform
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name
`comments`|`array` *optional*|Comments to post as part of the review
`commit_id`|`string` *optional*|The SHA of the commit that needs a review

---
#### Tool: **`create_repository`**
Create a new GitHub repository in your account
Parameters|Type|Description
-|-|-
`name`|`string`|Repository name
`autoInit`|`boolean` *optional*|Initialize with README.md
`description`|`string` *optional*|Repository description
`private`|`boolean` *optional*|Whether the repository should be private

---
#### Tool: **`fork_repository`**
Fork a GitHub repository to your account or specified organization
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`repo`|`string`|Repository name
`organization`|`string` *optional*|Optional: organization to fork to (defaults to your personal account)

---
#### Tool: **`get_file_contents`**
Get the contents of a file or directory from a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`path`|`string`|Path to the file or directory
`repo`|`string`|Repository name
`branch`|`string` *optional*|Branch to get contents from

---
#### Tool: **`get_issue`**
Get details of a specific issue in a GitHub repository.
Parameters|Type|Description
-|-|-
`issue_number`|`number`|
`owner`|`string`|
`repo`|`string`|

---
#### Tool: **`get_pull_request`**
Get details of a specific pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_comments`**
Get the review comments on a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_files`**
Get the list of files changed in a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_reviews`**
Get the reviews on a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`get_pull_request_status`**
Get the combined status of all status checks for a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name

---
#### Tool: **`list_commits`**
Get list of commits of a branch in a GitHub repository
Parameters|Type|Description
-|-|-
`owner`|`string`|
`repo`|`string`|
`page`|`number` *optional*|
`perPage`|`number` *optional*|
`sha`|`string` *optional*|

---
#### Tool: **`list_issues`**
List issues in a GitHub repository with filtering options
Parameters|Type|Description
-|-|-
`owner`|`string`|
`repo`|`string`|
`direction`|`string` *optional*|
`labels`|`array` *optional*|
`page`|`number` *optional*|
`per_page`|`number` *optional*|
`since`|`string` *optional*|
`sort`|`string` *optional*|
`state`|`string` *optional*|

---
#### Tool: **`list_pull_requests`**
List and filter repository pull requests
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`repo`|`string`|Repository name
`base`|`string` *optional*|Filter by base branch name
`direction`|`string` *optional*|The direction of the sort
`head`|`string` *optional*|Filter by head user or head organization and branch name
`page`|`number` *optional*|Page number of the results
`per_page`|`number` *optional*|Results per page (max 100)
`sort`|`string` *optional*|What to sort results by
`state`|`string` *optional*|State of the pull requests to return

---
#### Tool: **`merge_pull_request`**
Merge a pull request
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name
`commit_message`|`string` *optional*|Extra detail to append to automatic commit message
`commit_title`|`string` *optional*|Title for the automatic commit message
`merge_method`|`string` *optional*|Merge method to use

---
#### Tool: **`push_files`**
Push multiple files to a GitHub repository in a single commit
Parameters|Type|Description
-|-|-
`branch`|`string`|Branch to push to (e.g., 'main' or 'master')
`files`|`array`|Array of files to push
`message`|`string`|Commit message
`owner`|`string`|Repository owner (username or organization)
`repo`|`string`|Repository name

---
#### Tool: **`search_code`**
Search for code across GitHub repositories
Parameters|Type|Description
-|-|-
`q`|`string`|
`order`|`string` *optional*|
`page`|`number` *optional*|
`per_page`|`number` *optional*|

---
#### Tool: **`search_issues`**
Search for issues and pull requests across GitHub repositories
Parameters|Type|Description
-|-|-
`q`|`string`|
`order`|`string` *optional*|
`page`|`number` *optional*|
`per_page`|`number` *optional*|
`sort`|`string` *optional*|

---
#### Tool: **`search_repositories`**
Search for GitHub repositories
Parameters|Type|Description
-|-|-
`query`|`string`|Search query (see GitHub search syntax)
`page`|`number` *optional*|Page number for pagination (default: 1)
`perPage`|`number` *optional*|Number of results per page (default: 30, max: 100)

---
#### Tool: **`search_users`**
Search for users on GitHub
Parameters|Type|Description
-|-|-
`q`|`string`|
`order`|`string` *optional*|
`page`|`number` *optional*|
`per_page`|`number` *optional*|
`sort`|`string` *optional*|

---
#### Tool: **`update_issue`**
Update an existing issue in a GitHub repository
Parameters|Type|Description
-|-|-
`issue_number`|`number`|
`owner`|`string`|
`repo`|`string`|
`assignees`|`array` *optional*|
`body`|`string` *optional*|
`labels`|`array` *optional*|
`milestone`|`number` *optional*|
`state`|`string` *optional*|
`title`|`string` *optional*|

---
#### Tool: **`update_pull_request_branch`**
Update a pull request branch with the latest changes from the base branch
Parameters|Type|Description
-|-|-
`owner`|`string`|Repository owner (username or organization)
`pull_number`|`number`|Pull request number
`repo`|`string`|Repository name
`expected_head_sha`|`string` *optional*|The expected SHA of the pull request's HEAD ref

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

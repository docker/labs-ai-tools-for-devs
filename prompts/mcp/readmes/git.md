# Git MCP Server

A Model Context Protocol server for Git repository interaction and automation

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`git_add`|Adds file contents to the staging area|
`git_checkout`|Switches branches|
`git_commit`|Records changes to the repository|
`git_create_branch`|Creates a new branch from an optional base branch|
`git_diff`|Shows differences between branches or commits|
`git_diff_staged`|Shows changes that are staged for commit|
`git_diff_unstaged`|Shows changes in the working directory that are not yet staged|
`git_init`|Initialize a new Git repository|
`git_log`|Shows the commit logs|
`git_reset`|Unstages all staged changes|
`git_show`|Shows the contents of a commit|
`git_status`|Shows the working tree status|

---
## Tools Details

#### Tool: **`git_add`**
Adds file contents to the staging area
Parameters|Type|Description
-|-|-
`files`|`array`|
`repo_path`|`string`|

---
#### Tool: **`git_checkout`**
Switches branches
Parameters|Type|Description
-|-|-
`branch_name`|`string`|
`repo_path`|`string`|

---
#### Tool: **`git_commit`**
Records changes to the repository
Parameters|Type|Description
-|-|-
`message`|`string`|
`repo_path`|`string`|

---
#### Tool: **`git_create_branch`**
Creates a new branch from an optional base branch
Parameters|Type|Description
-|-|-
`branch_name`|`string`|
`repo_path`|`string`|
`base_branch`|`string` *optional*|

---
#### Tool: **`git_diff`**
Shows differences between branches or commits
Parameters|Type|Description
-|-|-
`repo_path`|`string`|
`target`|`string`|

---
#### Tool: **`git_diff_staged`**
Shows changes that are staged for commit
Parameters|Type|Description
-|-|-
`repo_path`|`string`|

---
#### Tool: **`git_diff_unstaged`**
Shows changes in the working directory that are not yet staged
Parameters|Type|Description
-|-|-
`repo_path`|`string`|

---
#### Tool: **`git_init`**
Initialize a new Git repository
Parameters|Type|Description
-|-|-
`repo_path`|`string`|

---
#### Tool: **`git_log`**
Shows the commit logs
Parameters|Type|Description
-|-|-
`repo_path`|`string`|
`max_count`|`integer` *optional*|

---
#### Tool: **`git_reset`**
Unstages all staged changes
Parameters|Type|Description
-|-|-
`repo_path`|`string`|

---
#### Tool: **`git_show`**
Shows the contents of a commit
Parameters|Type|Description
-|-|-
`repo_path`|`string`|
`revision`|`string`|

---
#### Tool: **`git_status`**
Shows the working tree status
Parameters|Type|Description
-|-|-
`repo_path`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "git": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/git"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

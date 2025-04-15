# git MCP Server

A Model Context Protocol server for Git repository interaction and automation

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Summary
1. `git_add` Adds file contents to the staging area
1. `git_checkout` Switches branches
1. `git_commit` Records changes to the repository
1. `git_create_branch` Creates a new branch from an optional base branch
1. `git_diff` Shows differences between branches or commits
1. `git_diff_staged` Shows changes that are staged for commit
1. `git_diff_unstaged` Shows changes in the working directory that are not yet staged
1. `git_init` Initialize a new Git repository
1. `git_log` Shows the commit logs
1. `git_reset` Unstages all staged changes
1. `git_show` Shows the contents of a commit
1. `git_status` Shows the working tree status

## Tools

### Tool `git_add`
Adds file contents to the staging area

Parameter|Type|Description
-|-|-
`files`|`array`|
`repo_path`|`string`|

### Tool `git_checkout`
Switches branches

Parameter|Type|Description
-|-|-
`branch_name`|`string`|
`repo_path`|`string`|

### Tool `git_commit`
Records changes to the repository

Parameter|Type|Description
-|-|-
`message`|`string`|
`repo_path`|`string`|

### Tool `git_create_branch`
Creates a new branch from an optional base branch

Parameter|Type|Description
-|-|-
`branch_name`|`string`|
`repo_path`|`string`|
`base_branch`|`string` *optional*|

### Tool `git_diff`
Shows differences between branches or commits

Parameter|Type|Description
-|-|-
`repo_path`|`string`|
`target`|`string`|

### Tool `git_diff_staged`
Shows changes that are staged for commit

Parameter|Type|Description
-|-|-
`repo_path`|`string`|

### Tool `git_diff_unstaged`
Shows changes in the working directory that are not yet staged

Parameter|Type|Description
-|-|-
`repo_path`|`string`|

### Tool `git_init`
Initialize a new Git repository

Parameter|Type|Description
-|-|-
`repo_path`|`string`|

### Tool `git_log`
Shows the commit logs

Parameter|Type|Description
-|-|-
`repo_path`|`string`|
`max_count`|`integer` *optional*|

### Tool `git_reset`
Unstages all staged changes

Parameter|Type|Description
-|-|-
`repo_path`|`string`|

### Tool `git_show`
Shows the contents of a commit

Parameter|Type|Description
-|-|-
`repo_path`|`string`|
`revision`|`string`|

### Tool `git_status`
Shows the working tree status

Parameter|Type|Description
-|-|-
`repo_path`|`string`|

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

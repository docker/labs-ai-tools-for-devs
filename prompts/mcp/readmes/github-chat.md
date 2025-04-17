# Github-chat MCP Server

A Model Context Protocol (MCP) for analyzing and querying GitHub repositories using the GitHub Chat API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[AsyncFuncAI](https://github.com/AsyncFuncAI)
**Repository**|https://github.com/AsyncFuncAI/github-chat-mcp
**Dockerfile**|https://github.com/AsyncFuncAI/github-chat-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/github-chat)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`index_repository`|Index a GitHub repository to analyze its codebase.|
`query_repository`|Ask questions about a GitHub repository and receive detailed AI responses.|

---
## Tools Details

#### Tool: **`index_repository`**
Index a GitHub repository to analyze its codebase. This must be done before asking questions about the repository.
Parameters|Type|Description
-|-|-
`repo_url`|`string`|The GitHub repository URL to index (format: https://github.com/username/repo).

---
#### Tool: **`query_repository`**
Ask questions about a GitHub repository and receive detailed AI responses. The repository must be indexed first.
Parameters|Type|Description
-|-|-
`question`|`string`|The question to ask about the repository.
`repo_url`|`string`|The GitHub repository URL to query (format: https://github.com/username/repo).
`conversation_history`|`string` *optional*|Previous conversation history for multi-turn conversations.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "github-chat": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_API_KEY",
        "mcp/github-chat"
      ],
      "env": {
        "GITHUB_API_KEY": "YOUR_GITHUB_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

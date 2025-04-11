# ryojerryyu-mcp-server-memos-py MCP Server

A Python package enabling LLM models to interact with the Memos server via the MCP interface for searching, creating, retrieving, and managing memos.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [RyoJerryYu](https://github.com/RyoJerryYu) |
| **Repository** | https://github.com/RyoJerryYu/mcp-server-memos-py |
| **Dockerfile** | https://github.com/RyoJerryYu/mcp-server-memos-py/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create_memo`**: Create a new memo
 1. **`get_memo`**: Get a memo
 1. **`list_memo_tags`**: List all existing memo tags
 1. **`search_memo`**: Search for memos

## Tools

### Tool: **`create_memo`**

Create a new memo

| Parameter | Type | Description |
| - | - | - |
| `content` | `string` | The content of the memo. |
| `visibility` | `string` *optional* | The visibility of the memo. |

### Tool: **`get_memo`**

Get a memo

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | The name of the memo.
Format: memos/{id}
 |

### Tool: **`list_memo_tags`**

List all existing memo tags

| Parameter | Type | Description |
| - | - | - |
| `parent` | `string` *optional* | The parent, who owns the tags.
Format: memos/{id}. Use "memos/-" to list all tags.
 |
| `visibility` | `string` *optional* | The visibility of the tags. |

### Tool: **`search_memo`**

Search for memos

| Parameter | Type | Description |
| - | - | - |
| `key_word` | `string` | The key words to search for in the memo content. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ryojerryyu-mcp-server-memos-py": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/ryojerryyu-mcp-server-memos-py"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ryojerryyu-mcp-server-memos-py -f Dockerfile https://github.com/RyoJerryYu/mcp-server-memos-py.git#master
```


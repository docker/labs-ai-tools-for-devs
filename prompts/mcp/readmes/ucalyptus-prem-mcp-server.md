# ucalyptus-prem-mcp-server MCP Server

Implementation of an MCP Server to use the Prem SDK

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [ucalyptus](https://github.com/ucalyptus) |
| **Repository** | https://github.com/ucalyptus/prem-mcp-server |
| **Dockerfile** | https://github.com/ucalyptus/prem-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`chat`**: Chat with Prem AI - supports chat completions with optional RAG capabilities.
 1. **`prem_chat_with_template`**: Chat using a predefined Prem AI prompt template
 1. **`prem_upload_document`**: Upload a document to a Prem AI repository

## Tools

### Tool: **`chat`**

Chat with Prem AI - supports chat completions with optional RAG capabilities.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The chat message to send |
| `limit` | `number` *optional* | Optional limit of context chunks for RAG |
| `max_tokens` | `number` *optional* | Optional maximum tokens to generate |
| `model` | `string` *optional* | Optional model to use for completion |
| `repository_ids` | `array` *optional* | Optional array of repository IDs for RAG |
| `similarity_threshold` | `number` *optional* | Optional similarity threshold for RAG |
| `system_prompt` | `string` *optional* | Optional system prompt to guide the model's behavior |
| `temperature` | `number` *optional* | Optional temperature for response generation |

### Tool: **`prem_chat_with_template`**

Chat using a predefined Prem AI prompt template

| Parameter | Type | Description |
| - | - | - |
| `params` | `object` | Parameters to fill in the template |
| `template_id` | `string` | ID of the prompt template to use |
| `max_tokens` | `number` *optional* | Optional maximum tokens to generate |
| `model` | `string` *optional* | Optional model to use |
| `temperature` | `number` *optional* | Optional temperature parameter |

### Tool: **`prem_upload_document`**

Upload a document to a Prem AI repository

| Parameter | Type | Description |
| - | - | - |
| `file_path` | `string` | Path to the file to upload |
| `repository_id` | `string` | ID of the repository to upload to |

## Use this MCP Server

```json
{
  "mcpServers": {
    "ucalyptus-prem-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "PREM_PROJECT_ID"
        "-e"
        "PREM_API_KEY"
        "mcpcommunity/ucalyptus-prem-mcp-server"
      ],
      "env": {
        "PREM_PROJECT_ID": "YOUR_PREM_PROJECT_ID",
        "PREM_API_KEY": "YOUR_PREM_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ucalyptus-prem-mcp-server -f Dockerfile https://github.com/ucalyptus/prem-mcp-server.git
```


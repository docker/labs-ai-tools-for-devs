# baryhuang-mcp-server-any-openapi MCP Server

A MCP server that enables Claude to discover and call any API endpoint through semantic search. Intelligently chunks OpenAPI specifications to handle large API documentation, with built-in request execution capabilities. Perfect for integrating private APIs with Claude Desktop.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [baryhuang](https://github.com/baryhuang) |
| **Repository** | https://github.com/baryhuang/mcp-server-any-openapi |
| **Dockerfile** | https://github.com/baryhuang/mcp-server-any-openapi/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`any_openapi_api_request_schema`**: Get API endpoint schemas that match your intent. Returns endpoint details including path, method, parameters, and response formats.
 1. **`any_openapi_make_request`**: Make an actual REST API request with full control over method, headers, body, and parameters.

## Tools

### Tool: **`any_openapi_api_request_schema`**

Get API endpoint schemas that match your intent. Returns endpoint details including path, method, parameters, and response formats.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Describe what you want to do with the API (e.g., 'Get user profile information', 'Create a new job posting') |

### Tool: **`any_openapi_make_request`**

Make an actual REST API request with full control over method, headers, body, and parameters.

| Parameter | Type | Description |
| - | - | - |
| `method` | `string` | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `url` | `string` | Fully qualified API URL (e.g., https://api.example.com/users/123) |
| `body` | `object` *optional* | Request body (for POST, PUT, PATCH) |
| `headers` | `object` *optional* | Request headers |
| `query_params` | `object` *optional* | Query parameters |

## Use this MCP Server

```json
{
  "mcpServers": {
    "baryhuang-mcp-server-any-openapi": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/baryhuang-mcp-server-any-openapi"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/baryhuang-mcp-server-any-openapi -f Dockerfile https://github.com/baryhuang/mcp-server-any-openapi.git
```


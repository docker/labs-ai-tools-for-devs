# everything MCP Server

Reference / test server with prompts, resources, and tools

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [modelcontextprotocol](https://github.com/modelcontextprotocol) |
| **Repository** | https://github.com/modelcontextprotocol/servers |
| **Dockerfile** | https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/everything/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add`**: Adds two numbers
 1. **`annotatedMessage`**: Demonstrates how annotations can be used to provide metadata about content
 1. **`echo`**: Echoes back the input
 1. **`getTinyImage`**: Returns the MCP_TINY_IMAGE
 1. **`longRunningOperation`**: Demonstrates a long running operation with progress updates
 1. **`printEnv`**: Prints all environment variables, helpful for debugging MCP server configuration
 1. **`sampleLLM`**: Samples from an LLM using MCP's sampling feature

## Tools

### Tool: **`add`**

Adds two numbers

| Parameter | Type | Description |
| - | - | - |
| `a` | `number` | First number |
| `b` | `number` | Second number |

### Tool: **`annotatedMessage`**

Demonstrates how annotations can be used to provide metadata about content

| Parameter | Type | Description |
| - | - | - |
| `messageType` | `string` | Type of message to demonstrate different annotation patterns |
| `includeImage` | `boolean` *optional* | Whether to include an example image |

### Tool: **`echo`**

Echoes back the input

| Parameter | Type | Description |
| - | - | - |
| `message` | `string` | Message to echo |

### Tool: **`getTinyImage`**

Returns the MCP_TINY_IMAGE

### Tool: **`longRunningOperation`**

Demonstrates a long running operation with progress updates

| Parameter | Type | Description |
| - | - | - |
| `duration` | `number` *optional* | Duration of the operation in seconds |
| `steps` | `number` *optional* | Number of steps in the operation |

### Tool: **`printEnv`**

Prints all environment variables, helpful for debugging MCP server configuration

### Tool: **`sampleLLM`**

Samples from an LLM using MCP's sampling feature

| Parameter | Type | Description |
| - | - | - |
| `prompt` | `string` | The prompt to send to the LLM |
| `maxTokens` | `number` *optional* | Maximum number of tokens to generate |

## Use this MCP Server

```json
{
  "mcpServers": {
    "everything": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/everything"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/everything -f src/everything/Dockerfile https://github.com/modelcontextprotocol/servers.git#2025.4.6
```


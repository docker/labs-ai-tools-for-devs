# veyrax MCP Server

VeyraX MCP is the only connection you need to access all your tools in any MCP-compatible environment.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [VeyraX](https://github.com/VeyraX) |
| **Repository** | https://github.com/VeyraX/veyrax-mcp |
| **Dockerfile** | https://github.com/VeyraX/veyrax-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`get_flow`**: "Use this tool to retrieve a specific workflow by its ID.

Workflow is sequence of steps that are executed in order to get some result. Flow comes with description, steps and input schema of all methods to call.

You can call this tool once you have a flowId which usually you can get from: user directly OR using get-tools method."
 1. **`get_tools`**: "Use this tool to retrieve a list of available tools from the Veyrax API.
This will return dynamic tools that user has access to.
You can use this tool to get the list of tools, method names and parameters, and then use tool_call tool to call the tool with the provided parameters.
This method also returns all flows with name and id that user has access to (if any).
"
 1. **`tool_call`**: "Use this tool to execute a specific method of another tool with the provided parameters based on get-tools tool response.
You need to specify the tool name, method name, and any required parameters for that method."

## Tools

### Tool: **`get_flow`**

"Use this tool to retrieve a specific workflow by its ID.

Workflow is sequence of steps that are executed in order to get some result. Flow comes with description, steps and input schema of all methods to call.

You can call this tool once you have a flowId which usually you can get from: user directly OR using get-tools method."

| Parameter | Type | Description |
| - | - | - |
| `flowId` | `string` | The ID of the workflow to retrieve. |

### Tool: **`get_tools`**

"Use this tool to retrieve a list of available tools from the Veyrax API.
This will return dynamic tools that user has access to.
You can use this tool to get the list of tools, method names and parameters, and then use tool_call tool to call the tool with the provided parameters.
This method also returns all flows with name and id that user has access to (if any).
"

### Tool: **`tool_call`**

"Use this tool to execute a specific method of another tool with the provided parameters based on get-tools tool response.
You need to specify the tool name, method name, and any required parameters for that method."

| Parameter | Type | Description |
| - | - | - |
| `method` | `string` | The method of the tool to call (e.g., 'get_messages', 'send_message', 'list_events') |
| `tool` | `string` | The name of the tool to call (e.g., 'gmail', 'google-calendar', 'slack') |
| `parameters` | `object` *optional* | The parameters required by the specific tool method being called, it is MUST HAVE field. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "veyrax": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "VEYRAX_API_KEY"
        "mcp/veyrax"
      ],
      "env": {
        "VEYRAX_API_KEY": "your-veyrax-api-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/veyrax -f Dockerfile https://github.com/VeyraX/veyrax-mcp.git
```


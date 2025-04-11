# kalivaraprasad-gonapa-azure-mcp MCP Server

A Model Context Protocol (MCP) implementation that enables Claude Desktop to interact with Azure services. This integration allows Claude to query and manage Azure resources directly through natural language conversations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [kalivaraprasad-gonapa](https://github.com/kalivaraprasad-gonapa) |
| **Repository** | https://github.com/kalivaraprasad-gonapa/azure-mcp |
| **Dockerfile** | https://github.com/kalivaraprasad-gonapa/azure-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`list-tenants`**: List all available Azure tenants
 1. **`run-azure-code`**: Run Azure code
 1. **`select-tenant`**: Select Azure tenant and subscription

## Tools

### Tool: **`list-tenants`**

List all available Azure tenants

### Tool: **`run-azure-code`**

Run Azure code

| Parameter | Type | Description |
| - | - | - |
| `code` | `string` | Your job is to answer questions about Azure environment by writing Javascript code using Azure SDK. The code must adhere to a few rules:
- Use the provided client instances: 'resourceClient' for ResourceManagementClient and 'subscriptionClient' for SubscriptionClient
- DO NOT create new client instances or import Azure SDK packages
- Use async/await and promises
- Think step-by-step before writing the code
- Avoid hardcoded values like Resource IDs
- Handle errors gracefully
- Handle pagination correctly using for-await-of loops
- Data returned must be JSON containing only the minimal amount of data needed
- Code MUST "return" a value: string, number, boolean or JSON object |
| `reasoning` | `string` | The reasoning behind the code |
| `subscriptionId` | `string` *optional* | Azure Subscription ID |
| `tenantId` | `string` *optional* | Azure Tenant ID |

### Tool: **`select-tenant`**

Select Azure tenant and subscription

| Parameter | Type | Description |
| - | - | - |
| `subscriptionId` | `string` | Azure Subscription ID to select |
| `tenantId` | `string` | Azure Tenant ID to select |

## Use this MCP Server

```json
{
  "mcpServers": {
    "kalivaraprasad-gonapa-azure-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/kalivaraprasad-gonapa-azure-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/kalivaraprasad-gonapa-azure-mcp -f Dockerfile https://github.com/kalivaraprasad-gonapa/azure-mcp.git
```


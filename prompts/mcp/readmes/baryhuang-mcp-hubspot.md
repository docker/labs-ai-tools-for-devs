# baryhuang-mcp-hubspot MCP Server

An MCP server implementation that seamlessly connects Claude and other AI models to HubSpot CRM data. Provides tools for managing contacts, companies, and engagement activities through standardized interfaces. Simplifies contact creation, duplicate detection, and pipeline management with minimal configuration.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [baryhuang](https://github.com/baryhuang) |
| **Repository** | https://github.com/baryhuang/mcp-hubspot |
| **Dockerfile** | https://github.com/baryhuang/mcp-hubspot/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`hubspot_create_company`**: Create a new company in HubSpot
 1. **`hubspot_create_contact`**: Create a new contact in HubSpot
 1. **`hubspot_get_active_companies`**: Get most recently active companies from HubSpot
 1. **`hubspot_get_active_contacts`**: Get most recently active contacts from HubSpot
 1. **`hubspot_get_company_activity`**: Get activity history for a specific company
 1. **`hubspot_get_recent_engagements`**: Get recent engagement activities across all contacts and companies

## Tools

### Tool: **`hubspot_create_company`**

Create a new company in HubSpot

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Company name |
| `properties` | `object` *optional* | Additional company properties |

### Tool: **`hubspot_create_contact`**

Create a new contact in HubSpot

| Parameter | Type | Description |
| - | - | - |
| `firstname` | `string` | Contact's first name |
| `lastname` | `string` | Contact's last name |
| `email` | `string` *optional* | Contact's email address |
| `properties` | `object` *optional* | Additional contact properties |

### Tool: **`hubspot_get_active_companies`**

Get most recently active companies from HubSpot

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* | Maximum number of companies to return (default: 10) |

### Tool: **`hubspot_get_active_contacts`**

Get most recently active contacts from HubSpot

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* | Maximum number of contacts to return (default: 10) |

### Tool: **`hubspot_get_company_activity`**

Get activity history for a specific company

| Parameter | Type | Description |
| - | - | - |
| `company_id` | `string` | HubSpot company ID |

### Tool: **`hubspot_get_recent_engagements`**

Get recent engagement activities across all contacts and companies

| Parameter | Type | Description |
| - | - | - |
| `days` | `integer` *optional* | Number of days to look back (default: 7) |
| `limit` | `integer` *optional* | Maximum number of engagements to return (default: 50) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "baryhuang-mcp-hubspot": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "HUBSPOT_ACCESS_TOKEN"
        "mcpcommunity/baryhuang-mcp-hubspot"
      ],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "YOUR_HUBSPOT_ACCESS_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/baryhuang-mcp-hubspot -f Dockerfile https://github.com/baryhuang/mcp-hubspot.git
```


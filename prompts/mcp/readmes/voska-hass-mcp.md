# voska-hass-mcp MCP Server

Home Assistant MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [voska](https://github.com/voska) |
| **Repository** | https://github.com/voska/hass-mcp |
| **Dockerfile** | https://github.com/voska/hass-mcp/blob/master/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`call_service_tool`**: Call any Home Assistant service (low-level API access)
 1. **`domain_summary_tool`**: Get a summary of entities in a specific domain
 1. **`entity_action`**: Perform an action on a Home Assistant entity (on, off, toggle)
 1. **`get_entity`**: Get the state of a Home Assistant entity with optional field filtering
 1. **`get_error_log`**: Get the Home Assistant error log for troubleshooting
 1. **`get_history`**: Get the history of an entity's state changes
 1. **`get_version`**: Get the Home Assistant version
 1. **`list_automations`**: Get a list of all automations from Home Assistant

This function retrieves all automations configured in Home Assistant,
including their IDs, entity IDs, state, and display names.
 1. **`list_entities`**: Get a list of Home Assistant entities with optional filtering
 1. **`restart_ha`**: Restart Home Assistant

⚠️ WARNING: Temporarily disrupts all Home Assistant operations
 1. **`search_entities_tool`**: Search for entities matching a query string
 1. **`system_overview`**: Get a comprehensive overview of the entire Home Assistant system

## Tools

### Tool: **`call_service_tool`**

Call any Home Assistant service (low-level API access)

| Parameter | Type | Description |
| - | - | - |
| `domain` | `string` | The domain of the service (e.g., 'light', 'switch', 'automation') |
| `service` | `string` | The service to call (e.g., 'turn_on', 'turn_off', 'toggle') |
| `data` | `string` *optional* | Optional data to pass to the service (e.g., {'entity_id': 'light.living_room'}) |

### Tool: **`domain_summary_tool`**

Get a summary of entities in a specific domain

| Parameter | Type | Description |
| - | - | - |
| `domain` | `string` | The domain to summarize (e.g., 'light', 'switch', 'sensor') |
| `example_limit` | `integer` *optional* | Maximum number of examples to include for each state |

### Tool: **`entity_action`**

Perform an action on a Home Assistant entity (on, off, toggle)

| Parameter | Type | Description |
| - | - | - |
| `action` | `string` | The action to perform ('on', 'off', 'toggle') |
| `entity_id` | `string` | The entity ID to control (e.g. 'light.living_room') |
| `params` | `string` |  |

### Tool: **`get_entity`**

Get the state of a Home Assistant entity with optional field filtering

| Parameter | Type | Description |
| - | - | - |
| `entity_id` | `string` | The entity ID to get (e.g. 'light.living_room') |
| `detailed` | `boolean` *optional* | If True, returns all entity fields without filtering |
| `fields` | `string` *optional* | Optional list of fields to include (e.g. ['state', 'attr.brightness']) |

### Tool: **`get_error_log`**

Get the Home Assistant error log for troubleshooting

Returns:
    A dictionary containing:
    - log_text: The full error log text
    - error_count: Number of ERROR entries found
    - warning_count: Number of WARNING entries found
    - integration_mentions: Map of integration names to mention counts
    - error: Error message if retrieval failed

Examples:
    Returns errors, warnings count and integration mentions
Best Practices:
    - Use this tool when troubleshooting specific Home Assistant errors
    - Look for patterns in repeated errors
    - Pay attention to timestamps to correlate errors with events
    - Focus on integrations with many mentions in the log

### Tool: **`get_history`**

Get the history of an entity's state changes

| Parameter | Type | Description |
| - | - | - |
| `entity_id` | `string` | The entity ID to get history for |
| `hours` | `integer` *optional* | Number of hours of history to retrieve (default: 24) |

### Tool: **`get_version`**

Get the Home Assistant version

Returns:
    A string with the Home Assistant version (e.g., "2025.3.0")

### Tool: **`list_automations`**

Get a list of all automations from Home Assistant

This function retrieves all automations configured in Home Assistant,
including their IDs, entity IDs, state, and display names.

Returns:
    A list of automation dictionaries, each containing id, entity_id, 
    state, and alias (friendly name) fields.

Examples:
    Returns all automation objects with state and friendly names

### Tool: **`list_entities`**

Get a list of Home Assistant entities with optional filtering

| Parameter | Type | Description |
| - | - | - |
| `detailed` | `boolean` *optional* | If True, returns all entity fields without filtering |
| `domain` | `string` *optional* | Optional domain to filter by (e.g., 'light', 'switch', 'sensor') |
| `fields` | `string` *optional* | Optional list of specific fields to include in each entity |
| `limit` | `integer` *optional* | Maximum number of entities to return (default: 100) |
| `search_query` | `string` *optional* | Optional search term to filter entities by name, id, or attributes |

### Tool: **`restart_ha`**

Restart Home Assistant

⚠️ WARNING: Temporarily disrupts all Home Assistant operations

Returns:
    Result of restart operation

### Tool: **`search_entities_tool`**

Search for entities matching a query string

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The search query to match against entity IDs, names, and attributes. |
| `limit` | `integer` *optional* | Maximum number of results to return (default: 20) |

### Tool: **`system_overview`**

Get a comprehensive overview of the entire Home Assistant system

Returns:
    A dictionary containing:
    - total_entities: Total count of all entities
    - domains: Dictionary of domains with their entity counts and state distributions
    - domain_samples: Representative sample entities for each domain (2-3 per domain)
    - domain_attributes: Common attributes for each domain
    - area_distribution: Entities grouped by area (if available)

Examples:
    Returns domain counts, sample entities, and common attributes
Best Practices:
    - Use this as the first call when exploring an unfamiliar Home Assistant instance
    - Perfect for building context about the structure of the smart home
    - After getting an overview, use domain_summary_tool to dig deeper into specific domains

## Use this MCP Server

```json
{
  "mcpServers": {
    "voska-hass-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/voska-hass-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/voska-hass-mcp -f Dockerfile https://github.com/voska/hass-mcp.git#master
```


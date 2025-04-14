# cyreslab-ai-shodan MCP Server

A Model Context Protocol server that provides access to Shodan API functionality

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [Cyreslab-AI](https://github.com/Cyreslab-AI) |
| **Repository** | https://github.com/Cyreslab-AI/shodan-mcp-server |
| **Dockerfile** | https://github.com/Cyreslab-AI/shodan-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`get_host_info`**: Get detailed information about a specific IP address
 1. **`get_ssl_info`**: Get SSL certificate information for a domain
 1. **`scan_network_range`**: Scan a network range (CIDR notation) for devices
 1. **`search_iot_devices`**: Search for specific types of IoT devices
 1. **`search_shodan`**: Search Shodan's database for devices and services

## Tools

### Tool: **`get_host_info`**

Get detailed information about a specific IP address

| Parameter | Type | Description |
| - | - | - |
| `ip` | `string` | IP address to look up |
| `fields` | `array` *optional* | List of fields to include in the results (e.g., ['ip_str', 'ports', 'location.country_name']) |
| `max_items` | `number` *optional* | Maximum number of items to include in arrays (default: 5) |

### Tool: **`get_ssl_info`**

Get SSL certificate information for a domain

| Parameter | Type | Description |
| - | - | - |
| `domain` | `string` | Domain name to look up SSL certificates for (e.g., example.com) |

### Tool: **`scan_network_range`**

Scan a network range (CIDR notation) for devices

| Parameter | Type | Description |
| - | - | - |
| `cidr` | `string` | Network range in CIDR notation (e.g., 192.168.1.0/24) |
| `fields` | `array` *optional* | List of fields to include in the results (e.g., ['ip_str', 'ports', 'location.country_name']) |
| `max_items` | `number` *optional* | Maximum number of items to include in results (default: 5) |

### Tool: **`search_iot_devices`**

Search for specific types of IoT devices

| Parameter | Type | Description |
| - | - | - |
| `device_type` | `string` | Type of IoT device to search for (e.g., 'webcam', 'router', 'smart tv') |
| `country` | `string` *optional* | Optional country code to limit search (e.g., 'US', 'DE') |
| `max_items` | `number` *optional* | Maximum number of items to include in results (default: 5) |

### Tool: **`search_shodan`**

Search Shodan's database for devices and services

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Shodan search query (e.g., 'apache country:US') |
| `facets` | `array` *optional* | List of facets to include in the search results (e.g., ['country', 'org']) |
| `fields` | `array` *optional* | List of fields to include in the results (e.g., ['ip_str', 'ports', 'location.country_name']) |
| `max_items` | `number` *optional* | Maximum number of items to include in arrays (default: 5) |
| `page` | `number` *optional* | Page number for results pagination (default: 1) |
| `summarize` | `boolean` *optional* | Whether to return a summary of the results instead of the full data (default: false) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "cyreslab-ai-shodan": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SHODAN_API_KEY",
        "mcp/cyreslab-ai-shodan"
      ],
      "env": {
        "SHODAN_API_KEY": "YOUR_SHODAN_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/cyreslab-ai-shodan -f Dockerfile https://github.com/Cyreslab-AI/shodan-mcp-server.git
```


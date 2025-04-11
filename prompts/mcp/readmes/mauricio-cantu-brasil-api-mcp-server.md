# mauricio-cantu-brasil-api-mcp-server MCP Server

A Model Context Protocol (MCP) server that provides tools to query BrasilAPI across different clients and LLMs. Enhance your AI apps with rich data from Brasil resources.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [mauricio-cantu](https://github.com/mauricio-cantu) |
| **Repository** | https://github.com/mauricio-cantu/brasil-api-mcp-server |
| **Dockerfile** | https://github.com/mauricio-cantu/brasil-api-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`get_all_banks`**: Get information of all banks from Brazil.
 1. **`get_bank_by_code`**: Get information from a specific bank given its code. The code from each bank is returned by get_all_banks tool.
 1. **`get_cnpj`**: Get information about a company given a CNPJ.
 1. **`get_isbn`**: Get information about a book given an ISBN.
 1. **`get_postal_code_v1`**: Get a location data given a CEP (postal code).
 1. **`get_postal_code_v2`**: Version 2 of get a location data given a CEP (postal code).

## Tools

### Tool: **`get_all_banks`**

Get information of all banks from Brazil.

### Tool: **`get_bank_by_code`**

Get information from a specific bank given its code. The code from each bank is returned by get_all_banks tool.

| Parameter | Type | Description |
| - | - | - |
| `code` | `number` |  |

### Tool: **`get_cnpj`**

Get information about a company given a CNPJ.

| Parameter | Type | Description |
| - | - | - |
| `CNPJ` | `string` | The CNPJ to query |

### Tool: **`get_isbn`**

Get information about a book given an ISBN.

| Parameter | Type | Description |
| - | - | - |
| `ISBN` | `string` | The book's ISBN to query |

### Tool: **`get_postal_code_v1`**

Get a location data given a CEP (postal code).

| Parameter | Type | Description |
| - | - | - |
| `cep` | `string` | The CEP to query |

### Tool: **`get_postal_code_v2`**

Version 2 of get a location data given a CEP (postal code).

| Parameter | Type | Description |
| - | - | - |
| `cep` | `string` | The CEP to query |

## Use this MCP Server

```json
{
  "mcpServers": {
    "mauricio-cantu-brasil-api-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/mauricio-cantu-brasil-api-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/mauricio-cantu-brasil-api-mcp-server -f Dockerfile https://github.com/mauricio-cantu/brasil-api-mcp-server.git
```


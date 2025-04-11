# alexanimal-tradovate-mcp-server MCP Server

Tradovate MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [alexanimal](https://github.com/alexanimal) |
| **Repository** | https://github.com/alexanimal/tradovate-mcp-server |
| **Dockerfile** | https://github.com/alexanimal/tradovate-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`cancel_order`**: Cancel an existing order
 1. **`find_product`**: Find a specific product by name
 1. **`get_account_summary`**: Get account summary information
 1. **`get_contract_details`**: Get detailed information about a specific contract by symbol
 1. **`get_market_data`**: Get market data for a specific contract
 1. **`liquidate_position`**: Close an existing position
 1. **`list_exchanges`**: List available exchanges from Tradovate
 1. **`list_orders`**: List orders for an account
 1. **`list_positions`**: List all positions for an account
 1. **`list_products`**: List available products or get a specific product by contractId
 1. **`modify_order`**: Modify an existing order
 1. **`place_order`**: Place a new order

## Tools

### Tool: **`cancel_order`**

Cancel an existing order

| Parameter | Type | Description |
| - | - | - |
| `orderId` | `string` | The order ID to cancel |

### Tool: **`find_product`**

Find a specific product by name

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | The product name to search for |

### Tool: **`get_account_summary`**

Get account summary information

| Parameter | Type | Description |
| - | - | - |
| `accountId` | `string` *optional* | The account ID (optional, will use default if not provided) |

### Tool: **`get_contract_details`**

Get detailed information about a specific contract by symbol

| Parameter | Type | Description |
| - | - | - |
| `symbol` | `string` | The contract symbol (e.g., ESZ4, NQZ4) |

### Tool: **`get_market_data`**

Get market data for a specific contract

| Parameter | Type | Description |
| - | - | - |
| `dataType` | `string` | Type of market data to retrieve |
| `symbol` | `string` | The contract symbol (e.g., ESZ4, NQZ4) |
| `chartTimeframe` | `string` *optional* | Timeframe for chart data |

### Tool: **`liquidate_position`**

Close an existing position

| Parameter | Type | Description |
| - | - | - |
| `symbol` | `string` | The contract symbol (e.g., ESZ4, NQZ4) |

### Tool: **`list_exchanges`**

List available exchanges from Tradovate

### Tool: **`list_orders`**

List orders for an account

| Parameter | Type | Description |
| - | - | - |
| `accountId` | `string` *optional* | The account ID (optional, will use default if not provided) |
| `status` | `string` *optional* | Filter orders by status (e.g., 'Working', 'Completed', 'Canceled') |

### Tool: **`list_positions`**

List all positions for an account

| Parameter | Type | Description |
| - | - | - |
| `accountId` | `string` *optional* | The account ID (optional, will use default if not provided) |

### Tool: **`list_products`**

List available products or get a specific product by contractId

| Parameter | Type | Description |
| - | - | - |
| `contractId` | `string` *optional* | The contract ID to filter by (optional, will return all products if not provided) |

### Tool: **`modify_order`**

Modify an existing order

| Parameter | Type | Description |
| - | - | - |
| `orderId` | `string` | The order ID to modify |
| `price` | `number` *optional* | New price for Limit and StopLimit orders |
| `quantity` | `number` *optional* | New quantity |
| `stopPrice` | `number` *optional* | New stop price for Stop and StopLimit orders |

### Tool: **`place_order`**

Place a new order

| Parameter | Type | Description |
| - | - | - |
| `action` | `string` | Buy or Sell |
| `orderType` | `string` | Type of order |
| `quantity` | `number` | Number of contracts |
| `symbol` | `string` | The contract symbol (e.g., ESZ4, NQZ4) |
| `price` | `number` *optional* | Price for Limit and StopLimit orders |
| `stopPrice` | `number` *optional* | Stop price for Stop and StopLimit orders |

## Use this MCP Server

```json
{
  "mcpServers": {
    "alexanimal-tradovate-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/alexanimal-tradovate-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/alexanimal-tradovate-mcp-server -f Dockerfile https://github.com/alexanimal/tradovate-mcp-server.git
```


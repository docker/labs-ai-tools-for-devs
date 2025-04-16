# Bitrefill MCP Server

A Model Context Protocol Server connector for Bitrefill public API, to enable AI agents to search and shop on Bitrefill.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[bitrefill](https://github.com/bitrefill)
**Repository**|https://github.com/bitrefill/bitrefill-mcp-server
**Dockerfile**|https://github.com/bitrefill/bitrefill-mcp-server/blob/master/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`categories`|Get the full product type/categories map.|
`create_invoice`|Create a new invoice for purchasing products with various payment methods|
`detail`|Get detailed information about a product|
`get_account_balance`|Retrieve your account balance|
`get_invoice`|Retrieve details for a specific invoice by ID|
`get_invoices`|Retrieve a list of invoices with optional filtering|
`get_order`|Retrieve details for a specific order by ID|
`get_orders`|Retrieve a list of orders with optional filtering|
`pay_invoice`|Pay an unpaid invoice (only works with 'balance' payment method)|
`ping`|Check if the Bitrefill API is available|
`search`|Search for gift cards, esims, mobile topups and more.|
`unseal_order`|Reveal codes and PINs for a specific order by ID|

---
## Tools Details

#### Tool: **`categories`**
Get the full product type/categories map. It's suggested to use this tool to get the categories and then use the `search` tool to search for products in a specific category.
#### Tool: **`create_invoice`**
Create a new invoice for purchasing products with various payment methods
Parameters|Type|Description
-|-|-
`payment_method`|`string`|Required payment method. Available methods: balance, lightning, bitcoin, eth_base, usdc_base
`products`|`array`|Array of products to include in the invoice
`auto_pay`|`boolean` *optional*|Optional: Automatically pay with balance
`webhook_url`|`string` *optional*|Optional: URL for webhook notifications

---
#### Tool: **`detail`**
Get detailed information about a product
Parameters|Type|Description
-|-|-
`id`|`string`|Unique identifier of the product

---
#### Tool: **`get_account_balance`**
Retrieve your account balance
#### Tool: **`get_invoice`**
Retrieve details for a specific invoice by ID
Parameters|Type|Description
-|-|-
`id`|`string`|Unique invoice identifier

---
#### Tool: **`get_invoices`**
Retrieve a list of invoices with optional filtering
Parameters|Type|Description
-|-|-
`after`|`string` *optional*|Start date for limiting results (Inclusive). Format: YYYY-MM-DD HH:MM:SS
`before`|`string` *optional*|End date for limiting results (Non-Inclusive). Format: YYYY-MM-DD HH:MM:SS
`limit`|`integer` *optional*|Maximum number of records. Maximum/Default: 50
`start`|`integer` *optional*|Start index. Default: 0

---
#### Tool: **`get_order`**
Retrieve details for a specific order by ID
Parameters|Type|Description
-|-|-
`id`|`string`|Unique order identifier

---
#### Tool: **`get_orders`**
Retrieve a list of orders with optional filtering
Parameters|Type|Description
-|-|-
`after`|`string` *optional*|Start date for limiting results (Inclusive). Format: YYYY-MM-DD HH:MM:SS
`before`|`string` *optional*|End date for limiting results (Non-Inclusive). Format: YYYY-MM-DD HH:MM:SS
`limit`|`integer` *optional*|Maximum number of records. Maximum/Default: 50
`start`|`integer` *optional*|Start index. Default: 0

---
#### Tool: **`pay_invoice`**
Pay an unpaid invoice (only works with 'balance' payment method)
Parameters|Type|Description
-|-|-
`id`|`string`|Unique invoice identifier

---
#### Tool: **`ping`**
Check if the Bitrefill API is available
#### Tool: **`search`**
Search for gift cards, esims, mobile topups and more. It's suggested to use the `categories` tool before searching for products, to have a better understanding of what's available.
Parameters|Type|Description
-|-|-
`query`|`string`|Search query (e.g., 'Amazon', 'Netflix', 'AT&T' or '*' for all the available products)
`beta_flags`|`string` *optional*|Beta feature flags
`cart`|`string` *optional*|Cart identifier
`category`|`string` *optional*|Filter by category (e.g., 'gaming', 'entertainment')
`col`|`number` *optional*|Column layout parameter
`country`|`string` *optional*|Country code (e.g., 'US', 'IT', 'GB')
`do_recommend`|`number` *optional*|Enable recommendations
`language`|`string` *optional*|Language code for results (e.g., 'en')
`limit`|`number` *optional*|Maximum number of results to return
`prefcc`|`number` *optional*|Preferred country code parameter
`rec`|`number` *optional*|Recommendation parameter
`sec`|`number` *optional*|Security parameter
`skip`|`number` *optional*|Number of results to skip (for pagination)
`src`|`string` *optional*|Source of the request

---
#### Tool: **`unseal_order`**
Reveal codes and PINs for a specific order by ID
Parameters|Type|Description
-|-|-
`id`|`string`|Unique order identifier

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "bitrefill": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "BITREFILL_API_ID",
        "-e",
        "BITREFILL_API_SECRET",
        "mcp/bitrefill"
      ],
      "env": {
        "BITREFILL_API_ID": "your_api_id_here",
        "BITREFILL_API_SECRET": "your_api_key_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

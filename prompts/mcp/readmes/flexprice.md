# Flexprice MCP Server

Official flexprice MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/flexprice](https://hub.docker.com/repository/docker/mcp/flexprice)
**Author**|[flexprice](https://github.com/flexprice)
**Repository**|https://github.com/flexprice/mcp-server
**Dockerfile**|https://github.com/flexprice/mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/flexprice)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`getCustomerById`|Get a customer by ID|
`getCustomerByLookupKey`|Get a customer by lookup key (external ID)|
`getCustomerEntitlements`|Get a customer's entitlements|
`getCustomerSubscriptions`|Get a customer's subscriptions|
`getCustomerUsageSummary`|Get a customer's usage summary|
`getCustomers`|Get all customers|
`getEventsByCustomer`|Get events for a customer|
`getInvoiceById`|Get an invoice by its ID|
`getInvoiceByNumber`|Get an invoice by its number|
`getInvoices`|Get invoices with optional filtering by date range and status|
`getInvoicesByCustomerId`|Get all invoices for a specific customer|
`getPaymentById`|Get a payment by ID|
`getPayments`|Get payments with optional filtering|
`getPlanById`|Get a plan by ID|
`getPlans`|Get all plans|
`getPriceById`|Get a price by ID|
`getPrices`|Get all prices|
`getSubscriptionById`|Get a subscription by ID|
`getSubscriptionPauses`|Get all pauses for a subscription|
`getSubscriptionUsage`|Get usage for a subscription|
`getSubscriptions`|Get all subscriptions|
`getWalletBalance`|Get the real-time balance of a wallet|
`getWalletById`|Get a wallet by ID|
`getWalletTransactions`|Get transactions for a wallet with pagination|
`getWalletsByCustomerId`|Get all wallets for a customer|

---
## Tools Details

#### Tool: **`getCustomerById`**
Get a customer by ID
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
#### Tool: **`getCustomerByLookupKey`**
Get a customer by lookup key (external ID)
Parameters|Type|Description
-|-|-
`lookupKey`|`string`|

---
#### Tool: **`getCustomerEntitlements`**
Get a customer's entitlements
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
#### Tool: **`getCustomerSubscriptions`**
Get a customer's subscriptions
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
#### Tool: **`getCustomerUsageSummary`**
Get a customer's usage summary
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
#### Tool: **`getCustomers`**
Get all customers
#### Tool: **`getEventsByCustomer`**
Get events for a customer
Parameters|Type|Description
-|-|-
`externalCustomerId`|`string`|
`endTime`|`string` *optional*|
`iterFirstKey`|`string` *optional*|
`iterLastKey`|`string` *optional*|
`startTime`|`string` *optional*|

---
#### Tool: **`getInvoiceById`**
Get an invoice by its ID
Parameters|Type|Description
-|-|-
`invoiceId`|`string`|

---
#### Tool: **`getInvoiceByNumber`**
Get an invoice by its number
Parameters|Type|Description
-|-|-
`invoiceNumber`|`string`|

---
#### Tool: **`getInvoices`**
Get invoices with optional filtering by date range and status
Parameters|Type|Description
-|-|-
`endDate`|`string` *optional*|ISO format date string for filtering invoices until this date
`limit`|`number` *optional*|Maximum number of invoices to return
`offset`|`number` *optional*|Number of invoices to skip for pagination
`startDate`|`string` *optional*|ISO format date string for filtering invoices from this date
`status`|`string` *optional*|Filter invoices by status

---
#### Tool: **`getInvoicesByCustomerId`**
Get all invoices for a specific customer
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
#### Tool: **`getPaymentById`**
Get a payment by ID
Parameters|Type|Description
-|-|-
`paymentId`|`string`|

---
#### Tool: **`getPayments`**
Get payments with optional filtering
Parameters|Type|Description
-|-|-
`customerId`|`string` *optional*|Filter payments by customer ID
`limit`|`number` *optional*|Maximum number of payments to return
`offset`|`number` *optional*|Number of payments to skip for pagination
`status`|`string` *optional*|Filter payments by status (pending, processed, failed)

---
#### Tool: **`getPlanById`**
Get a plan by ID
Parameters|Type|Description
-|-|-
`planId`|`string`|

---
#### Tool: **`getPlans`**
Get all plans
#### Tool: **`getPriceById`**
Get a price by ID
Parameters|Type|Description
-|-|-
`priceId`|`string`|

---
#### Tool: **`getPrices`**
Get all prices
#### Tool: **`getSubscriptionById`**
Get a subscription by ID
Parameters|Type|Description
-|-|-
`subscriptionId`|`string`|

---
#### Tool: **`getSubscriptionPauses`**
Get all pauses for a subscription
Parameters|Type|Description
-|-|-
`subscriptionId`|`string`|

---
#### Tool: **`getSubscriptionUsage`**
Get usage for a subscription
Parameters|Type|Description
-|-|-
`subscriptionId`|`string`|

---
#### Tool: **`getSubscriptions`**
Get all subscriptions
#### Tool: **`getWalletBalance`**
Get the real-time balance of a wallet
Parameters|Type|Description
-|-|-
`walletId`|`string`|

---
#### Tool: **`getWalletById`**
Get a wallet by ID
Parameters|Type|Description
-|-|-
`walletId`|`string`|

---
#### Tool: **`getWalletTransactions`**
Get transactions for a wallet with pagination
Parameters|Type|Description
-|-|-
`walletId`|`string`|
`limit`|`number` *optional*|Maximum number of transactions to return
`offset`|`number` *optional*|Number of transactions to skip for pagination

---
#### Tool: **`getWalletsByCustomerId`**
Get all wallets for a customer
Parameters|Type|Description
-|-|-
`customerId`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "BASE_URL",
        "-e",
        "API_KEY",
        "mcp/flexprice"
      ],
      "env": {
        "BASE_URL": "https://api.cloud.flexprice.io",
        "API_KEY": "your_api_key_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

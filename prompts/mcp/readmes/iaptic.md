# iaptic MCP Server

 Model Context Protocol server for interacting with iaptic

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [iaptic](https://github.com/iaptic) |
| **Repository** | https://github.com/iaptic/mcp-server-iaptic |
| **Dockerfile** | https://github.com/iaptic/mcp-server-iaptic/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`customer_add_purchase`**: Manually associate a customer with a purchase.
- Links a purchase to a specific customer
- Takes priority over receipt validation links
- Useful for manual purchase management
- Purchase format should be "platform:purchaseId", for example apple:123109519983
- Required: customerId and purchaseId
 1. **`customer_get`**: Get detailed information about a specific customer.
- Returns complete customer profile including:
  - Application username
  - Purchase history
  - Active and expired subscriptions
  - Last purchase details
  - Subscription renewal status
  - Trial and introductory period information
- Required: customerId parameter
 1. **`customer_list`**: List customers from your Iaptic account.
- Returns a paginated list of customers with their purchase status
- Each customer includes:
  - Application username
  - Last purchase information
  - Subscription status (active/lapsed)
  - Renewal intent
  - Trial/introductory period status
- Use limit and offset for pagination (default: 100 customers per page)
- Results are ordered by creation date (newest first)
 1. **`customer_subscription`**: Get customer's subscription status.
- Returns active subscription details if any
- Includes:
  - Subscription status and expiry
  - Payment and renewal information
  - Trial/introductory period status
- Simpler alternative to customer_get for subscription-only apps
 1. **`customer_transactions`**: Get customer's transaction history.
- Returns list of all transactions
- Includes:
  - Payment details
  - Transaction status
  - Associated purchases
  - Timestamps
 1. **`event_list`**: List recent events from your Iaptic account.
- Returns a paginated list of system events
- Events include:
  - Receipt validations
  - Platform notifications (Apple/Google/etc)
  - Webhook deliveries
  - Purchase status changes
  - Subscription renewals
- Use limit and offset for pagination
- Results ordered by date (newest first)
 1. **`iaptic_current_app`**: Get information about the currently active Iaptic app.
- Returns the current app name
- Indicates whether using default or custom credentials
- Shows if using a master key for authentication
 1. **`iaptic_reset_app`**: Reset to the default Iaptic app.
- Reverts to the original app credentials provided during server initialization
- All subsequent API calls will use the default app name and API key
- Use this after using iaptic_switch_app to return to the default app
 1. **`iaptic_switch_app`**: Switch to a different Iaptic app.
- Allows temporarily using a different app's credentials
- All subsequent API calls will use the new app name and API key
- If using a master key, only the app name needs to be changed
- Useful for managing multiple apps in the same session
- Required: appName parameter (apiKey required only if not using master key)
 1. **`purchase_get`**: Get detailed information about a specific purchase.
- Returns complete purchase details including:
  - Product information
  - Purchase status
  - Associated transactions
  - Customer information
  - Subscription details (if applicable)
- Required: purchaseId parameter
 1. **`purchase_list`**: List purchases from your Iaptic account.
- Returns a paginated list of purchases
- Use limit and offset for pagination (default: 100 per page)
- Filter by date range using startdate and enddate (ISO format)
- Filter by customerId to see purchases from a specific customer
- Results include purchase status, product info, and transaction details
- Results are ordered by purchase date (newest first)
 1. **`stats_app`**: Get statistics specific to your application.
- Returns app-specific metrics including:
  - App revenue and growth
  - Active subscriptions for this app
  - Customer metrics for this app
  - Product performance statistics
  - Transaction metrics
- Uses the app name provided during server initialization
 1. **`stats_get`**: Get general transactions, revenue and usage statistics from your Iaptic account.
- Returns aggregated metrics including:
  - Total revenue
  - Number of active subscriptions
  - Customer growth metrics
  - Transaction success rates
  - Revenue by product type
- Data is aggregated across all your applications
 1. **`stripe_prices`**: Get available Stripe products and prices.
- Returns list of products with their associated prices
- Each product includes:
  - Product ID and display name
  - Description and metadata
  - Available pricing offers
  - Subscription terms if applicable
- Results are cached for 5 minutes
 1. **`transaction_get`**: Get detailed information about a specific transaction.
- Returns complete transaction details including:
  - Transaction status
  - Amount and currency
  - Payment method details
  - Associated purchase information
  - Customer information
  - Timestamps and audit data
- Required: transactionId parameter
 1. **`transaction_list`**: List financial transactions from your Iaptic account.
- Returns a paginated list of transactions
- Use limit and offset for pagination (default: 100 per page)
- Filter by date range using startdate and enddate (ISO format)
- Filter by purchaseId to see transactions for a specific purchase
- Results include transaction status, amount, currency, and payment details
- Results are ordered by transaction date (newest first)
- Important: Use date filtering to avoid retrieving too many records

## Tools

### Tool: **`customer_add_purchase`**

Manually associate a customer with a purchase.
- Links a purchase to a specific customer
- Takes priority over receipt validation links
- Useful for manual purchase management
- Purchase format should be "platform:purchaseId", for example apple:123109519983
- Required: customerId and purchaseId

| Parameter | Type | Description |
| - | - | - |
| `customerId` | `string` | Application username of the customer |
| `purchaseId` | `string` | ID of the purchase to associate |

### Tool: **`customer_get`**

Get detailed information about a specific customer.
- Returns complete customer profile including:
  - Application username
  - Purchase history
  - Active and expired subscriptions
  - Last purchase details
  - Subscription renewal status
  - Trial and introductory period information
- Required: customerId parameter

| Parameter | Type | Description |
| - | - | - |
| `customerId` | `string` | Unique identifier of the customer |

### Tool: **`customer_list`**

List customers from your Iaptic account.
- Returns a paginated list of customers with their purchase status
- Each customer includes:
  - Application username
  - Last purchase information
  - Subscription status (active/lapsed)
  - Renewal intent
  - Trial/introductory period status
- Use limit and offset for pagination (default: 100 customers per page)
- Results are ordered by creation date (newest first)

| Parameter | Type | Description |
| - | - | - |
| `limit` | `number` *optional* | Maximum number of customers to return (default: 100) |
| `offset` | `number` *optional* | Number of customers to skip for pagination |

### Tool: **`customer_subscription`**

Get customer's subscription status.
- Returns active subscription details if any
- Includes:
  - Subscription status and expiry
  - Payment and renewal information
  - Trial/introductory period status
- Simpler alternative to customer_get for subscription-only apps

| Parameter | Type | Description |
| - | - | - |
| `customerId` | `string` | Application username of the customer |

### Tool: **`customer_transactions`**

Get customer's transaction history.
- Returns list of all transactions
- Includes:
  - Payment details
  - Transaction status
  - Associated purchases
  - Timestamps

| Parameter | Type | Description |
| - | - | - |
| `customerId` | `string` | Application username of the customer |

### Tool: **`event_list`**

List recent events from your Iaptic account.
- Returns a paginated list of system events
- Events include:
  - Receipt validations
  - Platform notifications (Apple/Google/etc)
  - Webhook deliveries
  - Purchase status changes
  - Subscription renewals
- Use limit and offset for pagination
- Results ordered by date (newest first)

| Parameter | Type | Description |
| - | - | - |
| `enddate` | `string` *optional* | Filter events before this date (ISO format, e.g. 2024-12-31) |
| `limit` | `number` *optional* | Maximum number of events to return (default: 100) |
| `offset` | `number` *optional* | Number of events to skip for pagination |
| `startdate` | `string` *optional* | Filter events after this date (ISO format, e.g. 2024-01-01) |

### Tool: **`iaptic_current_app`**

Get information about the currently active Iaptic app.
- Returns the current app name
- Indicates whether using default or custom credentials
- Shows if using a master key for authentication

### Tool: **`iaptic_reset_app`**

Reset to the default Iaptic app.
- Reverts to the original app credentials provided during server initialization
- All subsequent API calls will use the default app name and API key
- Use this after using iaptic_switch_app to return to the default app

### Tool: **`iaptic_switch_app`**

Switch to a different Iaptic app.
- Allows temporarily using a different app's credentials
- All subsequent API calls will use the new app name and API key
- If using a master key, only the app name needs to be changed
- Useful for managing multiple apps in the same session
- Required: appName parameter (apiKey required only if not using master key)

| Parameter | Type | Description |
| - | - | - |
| `appName` | `string` | Name of the app to switch to |
| `apiKey` | `string` *optional* | API key for the app (not required if using master key) |

### Tool: **`purchase_get`**

Get detailed information about a specific purchase.
- Returns complete purchase details including:
  - Product information
  - Purchase status
  - Associated transactions
  - Customer information
  - Subscription details (if applicable)
- Required: purchaseId parameter

| Parameter | Type | Description |
| - | - | - |
| `purchaseId` | `string` | Unique identifier of the purchase |

### Tool: **`purchase_list`**

List purchases from your Iaptic account.
- Returns a paginated list of purchases
- Use limit and offset for pagination (default: 100 per page)
- Filter by date range using startdate and enddate (ISO format)
- Filter by customerId to see purchases from a specific customer
- Results include purchase status, product info, and transaction details
- Results are ordered by purchase date (newest first)

| Parameter | Type | Description |
| - | - | - |
| `customerId` | `string` *optional* | Filter purchases by customer ID |
| `enddate` | `string` *optional* | Filter purchases before this date (ISO format, e.g. 2024-12-31) |
| `limit` | `number` *optional* | Maximum number of purchases to return (default: 100, max: 1000) |
| `offset` | `number` *optional* | Number of purchases to skip for pagination |
| `startdate` | `string` *optional* | Filter purchases after this date (ISO format, e.g. 2024-01-01) |

### Tool: **`stats_app`**

Get statistics specific to your application.
- Returns app-specific metrics including:
  - App revenue and growth
  - Active subscriptions for this app
  - Customer metrics for this app
  - Product performance statistics
  - Transaction metrics
- Uses the app name provided during server initialization

### Tool: **`stats_get`**

Get general transactions, revenue and usage statistics from your Iaptic account.
- Returns aggregated metrics including:
  - Total revenue
  - Number of active subscriptions
  - Customer growth metrics
  - Transaction success rates
  - Revenue by product type
- Data is aggregated across all your applications

### Tool: **`stripe_prices`**

Get available Stripe products and prices.
- Returns list of products with their associated prices
- Each product includes:
  - Product ID and display name
  - Description and metadata
  - Available pricing offers
  - Subscription terms if applicable
- Results are cached for 5 minutes

### Tool: **`transaction_get`**

Get detailed information about a specific transaction.
- Returns complete transaction details including:
  - Transaction status
  - Amount and currency
  - Payment method details
  - Associated purchase information
  - Customer information
  - Timestamps and audit data
- Required: transactionId parameter

| Parameter | Type | Description |
| - | - | - |
| `transactionId` | `string` | Unique identifier of the transaction |

### Tool: **`transaction_list`**

List financial transactions from your Iaptic account.
- Returns a paginated list of transactions
- Use limit and offset for pagination (default: 100 per page)
- Filter by date range using startdate and enddate (ISO format)
- Filter by purchaseId to see transactions for a specific purchase
- Results include transaction status, amount, currency, and payment details
- Results are ordered by transaction date (newest first)
- Important: Use date filtering to avoid retrieving too many records

| Parameter | Type | Description |
| - | - | - |
| `enddate` | `string` *optional* | Filter transactions before this date (ISO format, e.g. 2024-12-31) |
| `limit` | `number` *optional* | Maximum number of transactions to return (default: 100, max: 1000) |
| `offset` | `number` *optional* | Number of transactions to skip for pagination |
| `purchaseId` | `string` *optional* | Filter transactions by purchase ID |
| `startdate` | `string` *optional* | Filter transactions after this date (ISO format, e.g. 2024-01-01) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "iaptic": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "IAPTIC_APP_NAME"
        "-e"
        "IAPTIC_API_KEY"
        "mcp/iaptic"
      ],
      "env": {
        "IAPTIC_APP_NAME": "your-app-name-here",
        "IAPTIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/iaptic -f Dockerfile https://github.com/iaptic/mcp-server-iaptic.git
```


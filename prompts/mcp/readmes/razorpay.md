# Razorpay MCP Server

Razorpay's Official MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/razorpay](https://hub.docker.com/repository/docker/mcp/razorpay)
**Author**|[razorpay](https://github.com/razorpay)
**Repository**|https://github.com/razorpay/razorpay-mcp-server
**Dockerfile**|https://github.com/razorpay/razorpay-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/razorpay)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/razorpay --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_order`|Create a new order in Razorpay|
`create_payment_link`|Create a new payment link in Razorpay with a specified amount|
`create_refund`|Use this tool to create a normal refund for a payment.|
`fetch_all_orders`|Fetch all orders with optional filtering and pagination|
`fetch_order`|Fetch an order's details using its ID|
`fetch_payment`|Use this tool to retrieve the details of a specific payment using its id.|
`fetch_payment_link`|Fetch payment link details using it's ID.Response contains the basic details like amount, status etc|
`fetch_refund`|Use this tool to retrieve the details of a specific refund using its id.|
`update_refund`|Use this tool to update the notes for a specific refund.|

---
## Tools Details

#### Tool: **`create_order`**
Create a new order in Razorpay
Parameters|Type|Description
-|-|-
`amount`|`number`|Payment amount in the smallest currency sub-unit (e.g., for ₹295, use 29500)
`currency`|`string`|ISO code for the currency (e.g., INR, USD, SGD)
`first_payment_min_amount`|`number` *optional*|Minimum amount for first partial payment (only if partial_payment is true)
`notes`|`object` *optional*|Key-value pairs for additional information (max 15 pairs, 256 chars each)
`partial_payment`|`boolean` *optional*|Whether the customer can make partial payments
`receipt`|`string` *optional*|Receipt number for internal reference (max 40 chars, must be unique)

---
#### Tool: **`create_payment_link`**
Create a new payment link in Razorpay with a specified amount
Parameters|Type|Description
-|-|-
`amount`|`number`|Amount to be paid using the link in smallest currency unit(e.g., ₹300, use 30000)
`currency`|`string`|Three-letter ISO code for the currency (e.g., INR)
`description`|`string` *optional*|A brief description of the Payment Link explaining the intent of the payment.

---
#### Tool: **`create_refund`**
Use this tool to create a normal refund for a payment. Amount should be in the smallest currency unit (e.g., for ₹295, use 29500)
Parameters|Type|Description
-|-|-
`payment_id`|`string`|Unique identifier of the payment which needs to be refunded. ID should have a pay_ prefix.
`amount`|`number` *optional*|Payment amount in the smallest currency unit (e.g., for ₹295, use 29500)
`notes`|`object` *optional*|Key-value pairs used to store additional information. A maximum of 15 key-value pairs can be included.
`receipt`|`string` *optional*|A unique identifier provided by you for your internal reference.
`speed`|`string` *optional*|The speed at which the refund is to be processed. Default is 'normal'. For instant refunds, speed is set as 'optimum'.

---
#### Tool: **`fetch_all_orders`**
Fetch all orders with optional filtering and pagination
Parameters|Type|Description
-|-|-
`authorized`|`number` *optional*|Filter orders based on payment authorization status. Values: 0 (orders with unauthorized payments), 1 (orders with authorized payments)
`count`|`number` *optional*|Number of orders to be fetched (default: 10, max: 100)
`expand`|`array` *optional*|Used to retrieve additional information. Supported values: payments, payments.card, transfers, virtual_account
`from`|`number` *optional*|Timestamp (in Unix format) from when the orders should be fetched
`receipt`|`string` *optional*|Filter orders that contain the provided value for receipt
`skip`|`number` *optional*|Number of orders to be skipped (default: 0)
`to`|`number` *optional*|Timestamp (in Unix format) up till when orders are to be fetched

---
#### Tool: **`fetch_order`**
Fetch an order's details using its ID
Parameters|Type|Description
-|-|-
`order_id`|`string`|Unique identifier of the order to be retrieved

---
#### Tool: **`fetch_payment`**
Use this tool to retrieve the details of a specific payment using its id. Amount returned is in paisa
Parameters|Type|Description
-|-|-
`payment_id`|`string`|payment_id is unique identifier of the payment to be retrieved.

---
#### Tool: **`fetch_payment_link`**
Fetch payment link details using it's ID.Response contains the basic details like amount, status etc
Parameters|Type|Description
-|-|-
`payment_link_id`|`string`|ID of the payment link to be fetched(ID should have a plink_ prefix).

---
#### Tool: **`fetch_refund`**
Use this tool to retrieve the details of a specific refund using its id.
Parameters|Type|Description
-|-|-
`refund_id`|`string`|Unique identifier of the refund which is to be retrieved. ID should have a rfnd_ prefix.

---
#### Tool: **`update_refund`**
Use this tool to update the notes for a specific refund. Only the notes field can be modified.
Parameters|Type|Description
-|-|-
`notes`|`object`|Key-value pairs used to store additional information. A maximum of 15 key-value pairs can be included, with each value not exceeding 256 characters.
`refund_id`|`string`|Unique identifier of the refund which needs to be updated. ID should have a rfnd_ prefix.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RAZORPAY_KEY_ID",
        "-e",
        "RAZORPAY_KEY_SECRET",
        "mcp/razorpay"
      ],
      "env": {
        "RAZORPAY_KEY_ID": "your_razorpay_key_id",
        "RAZORPAY_KEY_SECRET": "your_razorpay_key_secret"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

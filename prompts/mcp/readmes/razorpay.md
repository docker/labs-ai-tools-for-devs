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
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_order`|Create a new order in Razorpay|
`create_payment_link`|Create a new payment link in Razorpay with a specified amount|
`fetch_order`|Fetch an order's details using its ID|
`fetch_payment`|Use this tool to retrieve the details of a specific payment using its id.|
`fetch_payment_link`|Fetch payment link details using it's ID.Response contains the basic details like amount, status etc|

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

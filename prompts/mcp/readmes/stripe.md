# Stripe MCP Server

Interact with Stripe services over the Stripe API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/stripe](https://hub.docker.com/repository/docker/mcp/stripe)
**Author**|[stripe](https://github.com/stripe)
**Repository**|https://github.com/stripe/agent-toolkit
**Dockerfile**|https://github.com/stripe/agent-toolkit/blob/main/modelcontextprotocol/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/stripe)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_customer`|This tool will create a customer in Stripe.|
`create_invoice`|This tool will create an invoice in Stripe.|
`create_invoice_item`|This tool will create an invoice item in Stripe.|
`create_payment_link`|This tool will create a payment link in Stripe.|
`create_price`|This tool will create a price in Stripe.|
`create_product`|This tool will create a product in Stripe.|
`create_refund`|This tool will refund a payment intent in Stripe.|
`finalize_invoice`|This tool will finalize an invoice in Stripe.|
`list_customers`|This tool will fetch a list of Customers from Stripe.|
`list_payment_intents`|This tool will list payment intents in Stripe.|
`list_prices`|This tool will fetch a list of Prices from Stripe.|
`list_products`|This tool will fetch a list of Products from Stripe.|
`retrieve_balance`|This tool will retrieve the balance from Stripe.|
`search_documentation`|This tool will take in a user question about integrating with Stripe in their application, then search and retrieve relevant Stripe documentation to answer the question.|

---
## Tools Details

#### Tool: **`create_customer`**
This tool will create a customer in Stripe.

It takes two arguments:
- name (str): The name of the customer.
- email (str, optional): The email of the customer.
Parameters|Type|Description
-|-|-
`name`|`string`|The name of the customer
`email`|`string` *optional*|The email of the customer

---
#### Tool: **`create_invoice`**
This tool will create an invoice in Stripe.

It takes one argument:
- customer (str): The ID of the customer to create the invoice for.
Parameters|Type|Description
-|-|-
`customer`|`string`|The ID of the customer to create the invoice for.
`days_until_due`|`integer` *optional*|The number of days until the invoice is due.

---
#### Tool: **`create_invoice_item`**
This tool will create an invoice item in Stripe.

It takes two arguments:
- customer (str): The ID of the customer to create the invoice item for.
- price (str): The ID of the price to create the invoice item for.
Parameters|Type|Description
-|-|-
`customer`|`string`|The ID of the customer to create the invoice item for.
`invoice`|`string`|The ID of the invoice to create the item for.
`price`|`string`|The ID of the price for the item.

---
#### Tool: **`create_payment_link`**
This tool will create a payment link in Stripe.

It takes two arguments:
- price (str): The ID of the price to create the payment link for.
- quantity (int): The quantity of the product to include in the payment link.
Parameters|Type|Description
-|-|-
`price`|`string`|The ID of the price to create the payment link for.
`quantity`|`integer`|The quantity of the product to include.

---
#### Tool: **`create_price`**
This tool will create a price in Stripe. If a product has not already been specified, a product should be created first.

It takes three arguments:
- product (str): The ID of the product to create the price for.
- unit_amount (int): The unit amount of the price in cents.
- currency (str): The currency of the price.
Parameters|Type|Description
-|-|-
`currency`|`string`|The currency of the price.
`product`|`string`|The ID of the product to create the price for.
`unit_amount`|`integer`|The unit amount of the price in cents.

---
#### Tool: **`create_product`**
This tool will create a product in Stripe.

It takes two arguments:
- name (str): The name of the product.
- description (str, optional): The description of the product.
Parameters|Type|Description
-|-|-
`name`|`string`|The name of the product.
`description`|`string` *optional*|The description of the product.

---
#### Tool: **`create_refund`**
This tool will refund a payment intent in Stripe.

It takes three arguments:
- payment_intent (str): The ID of the payment intent to refund.
- amount (int, optional): The amount to refund in cents.
- reason (str, optional): The reason for the refund.
Parameters|Type|Description
-|-|-
`payment_intent`|`string`|The ID of the PaymentIntent to refund.
`amount`|`integer` *optional*|The amount to refund in cents.

---
#### Tool: **`finalize_invoice`**
This tool will finalize an invoice in Stripe.

It takes one argument:
- invoice (str): The ID of the invoice to finalize.
Parameters|Type|Description
-|-|-
`invoice`|`string`|The ID of the invoice to finalize.

---
#### Tool: **`list_customers`**
This tool will fetch a list of Customers from Stripe.

It takes no input.
Parameters|Type|Description
-|-|-
`email`|`string` *optional*|A case-sensitive filter on the list based on the customer's email field. The value must be a string.
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100.

---
#### Tool: **`list_payment_intents`**
This tool will list payment intents in Stripe.

It takes two arguments:
- customer (str, optional): The ID of the customer to list payment intents for.
- limit (int, optional): The number of payment intents to return.
Parameters|Type|Description
-|-|-
`customer`|`string` *optional*|The ID of the customer to list payment intents for.
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100.

---
#### Tool: **`list_prices`**
This tool will fetch a list of Prices from Stripe.

It takes two arguments.
- product (str, optional): The ID of the product to list prices for.
- limit (int, optional): The number of prices to return.
Parameters|Type|Description
-|-|-
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.
`product`|`string` *optional*|The ID of the product to list prices for.

---
#### Tool: **`list_products`**
This tool will fetch a list of Products from Stripe.

It takes one optional argument:
- limit (int, optional): The number of products to return.
Parameters|Type|Description
-|-|-
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.

---
#### Tool: **`retrieve_balance`**
This tool will retrieve the balance from Stripe. It takes no input.
#### Tool: **`search_documentation`**
This tool will take in a user question about integrating with Stripe in their application, then search and retrieve relevant Stripe documentation to answer the question.

It takes two arguments:
- question (str): The user question to search an answer for in the Stripe documentation.
- language (str, optional): The programming language to search for in the the documentation.
Parameters|Type|Description
-|-|-
`question`|`string`|The user question about integrating with Stripe will be used to search the documentation.
`language`|`string` *optional*|The programming language to search for in the the documentation.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "stripe": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "STRIPE_SECRET_KEY",
        "mcp/stripe",
        "--tools=all"
      ],
      "env": {
        "STRIPE_SECRET_KEY": "sk_STRIPE_SECRET_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

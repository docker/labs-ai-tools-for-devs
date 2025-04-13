# stripe MCP Server

Interact with Stripe services over the Stripe API.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [stripe](https://github.com/stripe) |
| **Repository** | https://github.com/stripe/agent-toolkit |
| **Dockerfile** | https://github.com/stripe/agent-toolkit/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create_customer`**: This tool will create a customer in Stripe.

It takes two arguments:
- name (str): The name of the customer.
- email (str, optional): The email of the customer.
 1. **`create_invoice`**: This tool will create an invoice in Stripe.

It takes one argument:
- customer (str): The ID of the customer to create the invoice for.
 1. **`create_invoice_item`**: This tool will create an invoice item in Stripe.

It takes two arguments:
- customer (str): The ID of the customer to create the invoice item for.
- price (str): The ID of the price to create the invoice item for.
 1. **`create_payment_link`**: This tool will create a payment link in Stripe.

It takes two arguments:
- price (str): The ID of the price to create the payment link for.
- quantity (int): The quantity of the product to include in the payment link.
 1. **`create_price`**: This tool will create a price in Stripe. If a product has not already been specified, a product should be created first.

It takes three arguments:
- product (str): The ID of the product to create the price for.
- unit_amount (int): The unit amount of the price in cents.
- currency (str): The currency of the price.
 1. **`create_product`**: This tool will create a product in Stripe.

It takes two arguments:
- name (str): The name of the product.
- description (str, optional): The description of the product.
 1. **`create_refund`**: This tool will refund a payment intent in Stripe.

It takes three arguments:
- payment_intent (str): The ID of the payment intent to refund.
- amount (int, optional): The amount to refund in cents.
- reason (str, optional): The reason for the refund.
 1. **`finalize_invoice`**: This tool will finalize an invoice in Stripe.

It takes one argument:
- invoice (str): The ID of the invoice to finalize.
 1. **`list_customers`**: This tool will fetch a list of Customers from Stripe.

It takes no input.
 1. **`list_payment_intents`**: This tool will list payment intents in Stripe.

It takes two arguments:
- customer (str, optional): The ID of the customer to list payment intents for.
- limit (int, optional): The number of payment intents to return.
 1. **`list_prices`**: This tool will fetch a list of Prices from Stripe.

It takes two arguments.
- product (str, optional): The ID of the product to list prices for.
- limit (int, optional): The number of prices to return.
 1. **`list_products`**: This tool will fetch a list of Products from Stripe.

It takes one optional argument:
- limit (int, optional): The number of products to return.
 1. **`retrieve_balance`**: This tool will retrieve the balance from Stripe. It takes no input.
 1. **`search_documentation`**: This tool will take in a user question about integrating with Stripe in their application, then search and retrieve relevant Stripe documentation to answer the question.

It takes two arguments:
- question (str): The user question to search an answer for in the Stripe documentation.
- language (str, optional): The programming language to search for in the the documentation.

## Tools

### Tool: **`create_customer`**

This tool will create a customer in Stripe.

It takes two arguments:
- name (str): The name of the customer.
- email (str, optional): The email of the customer.

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | The name of the customer |
| `email` | `string` *optional* | The email of the customer |

### Tool: **`create_invoice`**

This tool will create an invoice in Stripe.

It takes one argument:
- customer (str): The ID of the customer to create the invoice for.

| Parameter | Type | Description |
| - | - | - |
| `customer` | `string` | The ID of the customer to create the invoice for. |
| `days_until_due` | `integer` *optional* | The number of days until the invoice is due. |

### Tool: **`create_invoice_item`**

This tool will create an invoice item in Stripe.

It takes two arguments:
- customer (str): The ID of the customer to create the invoice item for.
- price (str): The ID of the price to create the invoice item for.

| Parameter | Type | Description |
| - | - | - |
| `customer` | `string` | The ID of the customer to create the invoice item for. |
| `invoice` | `string` | The ID of the invoice to create the item for. |
| `price` | `string` | The ID of the price for the item. |

### Tool: **`create_payment_link`**

This tool will create a payment link in Stripe.

It takes two arguments:
- price (str): The ID of the price to create the payment link for.
- quantity (int): The quantity of the product to include in the payment link.

| Parameter | Type | Description |
| - | - | - |
| `price` | `string` | The ID of the price to create the payment link for. |
| `quantity` | `integer` | The quantity of the product to include. |

### Tool: **`create_price`**

This tool will create a price in Stripe. If a product has not already been specified, a product should be created first.

It takes three arguments:
- product (str): The ID of the product to create the price for.
- unit_amount (int): The unit amount of the price in cents.
- currency (str): The currency of the price.

| Parameter | Type | Description |
| - | - | - |
| `currency` | `string` | The currency of the price. |
| `product` | `string` | The ID of the product to create the price for. |
| `unit_amount` | `integer` | The unit amount of the price in cents. |

### Tool: **`create_product`**

This tool will create a product in Stripe.

It takes two arguments:
- name (str): The name of the product.
- description (str, optional): The description of the product.

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | The name of the product. |
| `description` | `string` *optional* | The description of the product. |

### Tool: **`create_refund`**

This tool will refund a payment intent in Stripe.

It takes three arguments:
- payment_intent (str): The ID of the payment intent to refund.
- amount (int, optional): The amount to refund in cents.
- reason (str, optional): The reason for the refund.

| Parameter | Type | Description |
| - | - | - |
| `payment_intent` | `string` | The ID of the PaymentIntent to refund. |
| `amount` | `integer` *optional* | The amount to refund in cents. |

### Tool: **`finalize_invoice`**

This tool will finalize an invoice in Stripe.

It takes one argument:
- invoice (str): The ID of the invoice to finalize.

| Parameter | Type | Description |
| - | - | - |
| `invoice` | `string` | The ID of the invoice to finalize. |

### Tool: **`list_customers`**

This tool will fetch a list of Customers from Stripe.

It takes no input.

| Parameter | Type | Description |
| - | - | - |
| `email` | `string` *optional* | A case-sensitive filter on the list based on the customer's email field. The value must be a string. |
| `limit` | `integer` *optional* | A limit on the number of objects to be returned. Limit can range between 1 and 100. |

### Tool: **`list_payment_intents`**

This tool will list payment intents in Stripe.

It takes two arguments:
- customer (str, optional): The ID of the customer to list payment intents for.
- limit (int, optional): The number of payment intents to return.

| Parameter | Type | Description |
| - | - | - |
| `customer` | `string` *optional* | The ID of the customer to list payment intents for. |
| `limit` | `integer` *optional* | A limit on the number of objects to be returned. Limit can range between 1 and 100. |

### Tool: **`list_prices`**

This tool will fetch a list of Prices from Stripe.

It takes two arguments.
- product (str, optional): The ID of the product to list prices for.
- limit (int, optional): The number of prices to return.

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* | A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10. |
| `product` | `string` *optional* | The ID of the product to list prices for. |

### Tool: **`list_products`**

This tool will fetch a list of Products from Stripe.

It takes one optional argument:
- limit (int, optional): The number of products to return.

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* | A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10. |

### Tool: **`retrieve_balance`**

This tool will retrieve the balance from Stripe. It takes no input.

### Tool: **`search_documentation`**

This tool will take in a user question about integrating with Stripe in their application, then search and retrieve relevant Stripe documentation to answer the question.

It takes two arguments:
- question (str): The user question to search an answer for in the Stripe documentation.
- language (str, optional): The programming language to search for in the the documentation.

| Parameter | Type | Description |
| - | - | - |
| `question` | `string` | The user question about integrating with Stripe will be used to search the documentation. |
| `language` | `string` *optional* | The programming language to search for in the the documentation. |

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

## Rebuild this image

```console
docker build -t mcp/stripe -f Dockerfile https://github.com/stripe/agent-toolkit.git#:modelcontextprotocol
```


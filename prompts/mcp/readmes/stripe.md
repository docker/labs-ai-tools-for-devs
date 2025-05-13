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
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/stripe --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`cancel_subscription`|This tool will cancel a subscription in Stripe.|
`create_coupon`|This tool will create a coupon in Stripe.|
`create_customer`|This tool will create a customer in Stripe.|
`create_invoice`|This tool will create an invoice in Stripe.|
`create_invoice_item`|This tool will create an invoice item in Stripe.|
`create_payment_link`|This tool will create a payment link in Stripe.|
`create_price`|This tool will create a price in Stripe.|
`create_product`|This tool will create a product in Stripe.|
`create_refund`|This tool will refund a payment intent in Stripe.|
`finalize_invoice`|This tool will finalize an invoice in Stripe.|
`list_coupons`|This tool will fetch a list of Coupons from Stripe.|
`list_customers`|This tool will fetch a list of Customers from Stripe.|
`list_disputes`|This tool will fetch a list of disputes in Stripe.|
`list_payment_intents`|This tool will list payment intents in Stripe.|
`list_prices`|This tool will fetch a list of Prices from Stripe.|
`list_products`|This tool will fetch a list of Products from Stripe.|
`list_subscriptions`|This tool will list all subscriptions in Stripe.|
`retrieve_balance`|This tool will retrieve the balance from Stripe.|
`update_dispute`|When you receive a dispute, contacting your customer is always the best first step.|
`update_subscription`|This tool will update an existing subscription in Stripe.|

---
## Tools Details

#### Tool: **`cancel_subscription`**
This tool will cancel a subscription in Stripe.

It takes the following arguments:
- subscription (str, required): The ID of the subscription to cancel.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The ID of the subscription to cancel.

---
#### Tool: **`create_coupon`**
This tool will create a coupon in Stripe.


It takes several arguments:
- name (str): The name of the coupon.

Only use one of percent_off or amount_off, not both:
- percent_off (number, optional): The percentage discount to apply (between 0 and 100).
- amount_off (number, optional): The amount to subtract from an invoice (in cents).

Optional arguments for duration. Use if specific duration is desired, otherwise default to 'once'.
- duration (str, optional): How long the discount will last ('once', 'repeating', or 'forever'). Defaults to 'once'.
- duration_in_months (number, optional): The number of months the discount will last if duration is repeating.
Parameters|Type|Description
-|-|-
`amount_off`|`number`|A positive integer representing the amount to subtract from an invoice total (required if percent_off is not passed)
`name`|`string`|Name of the coupon displayed to customers on invoices or receipts
`currency`|`string` *optional*|Three-letter ISO code for the currency of the amount_off parameter (required if amount_off is passed). Infer based on the amount_off. For example, if a coupon is $2 off, set currency to be USD.
`duration`|`string` *optional*|How long the discount will last. Defaults to "once"
`duration_in_months`|`number` *optional*|The number of months the discount will last if duration is repeating
`percent_off`|`number` *optional*|A positive float larger than 0, and smaller or equal to 100, that represents the discount the coupon will apply (required if amount_off is not passed)

---
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

  It takes two arguments:
  - customer (str): The ID of the customer to create the invoice for.

  - days_until_due (int, optional): The number of days until the invoice is due.
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
- invoice (str): The ID of the invoice to create the invoice item for.
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
#### Tool: **`list_coupons`**
This tool will fetch a list of Coupons from Stripe.

It takes one optional argument:
- limit (int, optional): The number of coupons to return.
Parameters|Type|Description
-|-|-
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100.

---
#### Tool: **`list_customers`**
This tool will fetch a list of Customers from Stripe.

It takes two arguments:
- limit (int, optional): The number of customers to return.
- email (str, optional): A case-sensitive filter on the list based on the customer's email field.
Parameters|Type|Description
-|-|-
`email`|`string` *optional*|A case-sensitive filter on the list based on the customer's email field. The value must be a string.
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100.

---
#### Tool: **`list_disputes`**
This tool will fetch a list of disputes in Stripe.

It takes the following arguments:
- charge (string, optional): Only return disputes associated to the charge specified by this charge ID.
- payment_intent (string, optional): Only return disputes associated to the PaymentIntent specified by this PaymentIntent ID.
Parameters|Type|Description
-|-|-
`charge`|`string` *optional*|Only return disputes associated to the charge specified by this charge ID.
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.
`payment_intent`|`string` *optional*|Only return disputes associated to the PaymentIntent specified by this PaymentIntent ID.

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
#### Tool: **`list_subscriptions`**
This tool will list all subscriptions in Stripe.

It takes four arguments:
- customer (str, optional): The ID of the customer to list subscriptions for.

- price (str, optional): The ID of the price to list subscriptions for.
- status (str, optional): The status of the subscriptions to list.
- limit (int, optional): The number of subscriptions to return.
Parameters|Type|Description
-|-|-
`customer`|`string` *optional*|The ID of the customer to list subscriptions for.
`limit`|`integer` *optional*|A limit on the number of objects to be returned. Limit can range between 1 and 100.
`price`|`string` *optional*|The ID of the price to list subscriptions for.
`status`|`string` *optional*|The status of the subscriptions to retrieve.

---
#### Tool: **`retrieve_balance`**
This tool will retrieve the balance from Stripe. It takes no input.
#### Tool: **`update_dispute`**
When you receive a dispute, contacting your customer is always the best first step. If that doesn't work, you can submit evidence to help resolve the dispute in your favor. This tool helps.

It takes the following arguments:
- dispute (string): The ID of the dispute to update
- evidence (object, optional): Evidence to upload for the dispute.
    - cancellation_policy_disclosure (string)
    - cancellation_rebuttal (string)
    - duplicate_charge_explanation (string)
    - uncategorized_text (string, optional): Any additional evidence or statements.
- submit (boolean, optional): Whether to immediately submit evidence to the bank. If false, evidence is staged on the dispute.
Parameters|Type|Description
-|-|-
`dispute`|`string`|The ID of the dispute to update
`evidence`|`object` *optional*|Evidence to upload, to respond to a dispute. Updating any field in the hash will submit all fields in the hash for review.
`submit`|`boolean` *optional*|Whether to immediately submit evidence to the bank. If false, evidence is staged on the dispute.

---
#### Tool: **`update_subscription`**
This tool will update an existing subscription in Stripe. If changing an existing subscription item, the existing subscription item has to be set to deleted and the new one has to be added.

  It takes the following arguments:
  - subscription (str, required): The ID of the subscription to update.
  - proration_behavior (str, optional): Determines how to handle prorations when the subscription items change. Options: 'create_prorations', 'none', 'always_invoice', 'none_implicit'.
  - items (array, optional): A list of subscription items to update, add, or remove. Each item can have the following properties:
    - id (str, optional): The ID of the subscription item to modify.
    - price (str, optional): The ID of the price to switch to.
    - quantity (int, optional): The quantity of the plan to subscribe to.
    - deleted (bool, optional): Whether to delete this item.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The ID of the subscription to update.
`items`|`array` *optional*|A list of subscription items to update, add, or remove.
`proration_behavior`|`string` *optional*|Determines how to handle prorations when the subscription items change.

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

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
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/razorpay --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`capture_payment`|Use this tool to capture a previously authorized payment.|
`close_qr_code`|Close a QR Code that's no longer needed|
`create_instant_settlement`|Create an instant settlement to get funds transferred to your bank account|
`create_order`|Create a new order in Razorpay|
`create_payment_link`|Create a new standard payment link in Razorpay with a specified amount|
`create_qr_code`|Create a new QR code in Razorpay that can be used to accept UPI payments|
`create_refund`|Use this tool to create a normal refund for a payment.|
`fetch_all_instant_settlements`|Fetch all instant settlements with optional filtering, pagination, and payout details|
`fetch_all_orders`|Fetch all orders with optional filtering and pagination|
`fetch_all_payment_links`|Fetch all payment links with optional filtering by payment ID or reference ID.You can specify the upi_link parameter to filter by link type.|
`fetch_all_payments`|Fetch all payments with optional filtering and pagination|
`fetch_all_payouts`|Fetch all payouts for a bank account number|
`fetch_all_qr_codes`|Fetch all QR codes with optional filtering and pagination|
`fetch_all_refunds`|Use this tool to retrieve details of all refunds.|
`fetch_all_settlements`|Fetch all settlements with optional filtering and pagination|
`fetch_instant_settlement_with_id`|Fetch details of a specific instant settlement using its ID|
`fetch_multiple_refunds_for_payment`|Use this tool to retrieve multiple refunds for a payment.|
`fetch_order`|Fetch an order's details using its ID|
`fetch_order_payments`|Fetch all payments made for a specific order in Razorpay|
`fetch_payment`|Use this tool to retrieve the details of a specific payment using its id.|
`fetch_payment_card_details`|Use this tool to retrieve the details of the card used to make a payment.|
`fetch_payment_link`|Fetch payment link details using it's ID.|
`fetch_payments_for_qr_code`|Fetch all payments made on a QR code|
`fetch_payout_with_id`|Fetch a payout's details using its ID|
`fetch_qr_code`|Fetch a QR code's details using it's ID|
`fetch_qr_codes_by_customer_id`|Fetch all QR codes for a specific customer|
`fetch_qr_codes_by_payment_id`|Fetch all QR codes for a specific payment|
`fetch_refund`|Use this tool to retrieve the details of a specific refund using its id.|
`fetch_settlement_recon_details`|Fetch settlement reconciliation report for a specific time period|
`fetch_settlement_with_id`|Fetch details of a specific settlement using its ID|
`fetch_specific_refund_for_payment`|Use this tool to retrieve details of a specific refund made for a payment.|
`payment_link_notify`|Send or resend notification for a payment link via SMS or email.|
`payment_link_upi.create`|Create a new UPI payment link in Razorpay with a specified amount and additional options.|
`update_order`|Use this tool to update the notes for a specific order.|
`update_payment`|Use this tool to update the notes field of a payment.|
`update_payment_link`|Update any existing standard or UPI payment link with new details such as reference ID, expiry date, or notes.|
`update_refund`|Use this tool to update the notes for a specific refund.|

---
## Tools Details

#### Tool: **`capture_payment`**
Use this tool to capture a previously authorized payment. Only payments with 'authorized' status can be captured
Parameters|Type|Description
-|-|-
`amount`|`number`|The amount to be captured (in paisa). Should be equal to the authorized amount
`currency`|`string`|ISO code of the currency in which the payment was made (e.g., INR)
`payment_id`|`string`|Unique identifier of the payment to be captured. Should start with 'pay_'

---
#### Tool: **`close_qr_code`**
Close a QR Code that's no longer needed
Parameters|Type|Description
-|-|-
`qr_code_id`|`string`|Unique identifier of the QR Code to be closedThe QR code id should start with 'qr_'

---
#### Tool: **`create_instant_settlement`**
Create an instant settlement to get funds transferred to your bank account
Parameters|Type|Description
-|-|-
`amount`|`number`|The amount you want to get settled instantly in amount in the smallest currency sub-unit (e.g., for ₹295, use 29500)
`description`|`string` *optional*|Custom note for the instant settlement.
`notes`|`object` *optional*|Key-value pairs for additional information. Max 15 pairs, 256 chars each
`settle_full_balance`|`boolean` *optional*|If true, Razorpay will settle the maximum amount possible and ignore amount parameter

---
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
Create a new standard payment link in Razorpay with a specified amount
Parameters|Type|Description
-|-|-
`amount`|`number`|Amount to be paid using the link in smallest currency unit(e.g., ₹300, use 30000)
`currency`|`string`|Three-letter ISO code for the currency (e.g., INR)
`accept_partial`|`boolean` *optional*|Indicates whether customers can make partial payments using the Payment Link. Default: false
`callback_method`|`string` *optional*|HTTP method for callback redirection. Must be 'get' if callback_url is set.
`callback_url`|`string` *optional*|If specified, adds a redirect URL to the Payment Link. Customer will be redirected here after payment.
`customer_contact`|`string` *optional*|Contact number of the customer.
`customer_email`|`string` *optional*|Email address of the customer.
`customer_name`|`string` *optional*|Name of the customer.
`description`|`string` *optional*|A brief description of the Payment Link explaining the intent of the payment.
`expire_by`|`number` *optional*|Timestamp, in Unix, when the Payment Link will expire. By default, a Payment Link will be valid for six months.
`first_min_partial_amount`|`number` *optional*|Minimum amount that must be paid by the customer as the first partial payment. Default value is 100.
`notes`|`object` *optional*|Key-value pairs that can be used to store additional information. Maximum 15 pairs, each value limited to 256 characters.
`notify_email`|`boolean` *optional*|Send email notifications for the Payment Link.
`notify_sms`|`boolean` *optional*|Send SMS notifications for the Payment Link.
`reference_id`|`string` *optional*|Reference number tagged to a Payment Link. Must be unique for each Payment Link. Max 40 characters.
`reminder_enable`|`boolean` *optional*|Enable payment reminders for the Payment Link.

---
#### Tool: **`create_qr_code`**
Create a new QR code in Razorpay that can be used to accept UPI payments
Parameters|Type|Description
-|-|-
`type`|`string`|The type of the QR Code. Currently only supports 'upi_qr'
`usage`|`string`|Whether QR should accept single or multiple payments. Possible values: 'single_use', 'multiple_use'
`close_by`|`number` *optional*|Unix timestamp at which QR Code should be automatically closed (min 2 mins after current time)
`customer_id`|`string` *optional*|The unique identifier of the customer to link with the QR Code
`description`|`string` *optional*|A brief description about the QR Code
`fixed_amount`|`boolean` *optional*|Whether QR should accept only specific amount (true) or any amount (false)
`name`|`string` *optional*|Label to identify the QR Code (e.g., 'Store Front Display')
`notes`|`object` *optional*|Key-value pairs for additional information (max 15 pairs, 256 chars each)
`payment_amount`|`number` *optional*|The specific amount allowed for transaction in smallest currency unit

---
#### Tool: **`create_refund`**
Use this tool to create a normal refund for a payment. Amount should be in the smallest currency unit (e.g., for ₹295, use 29500)
Parameters|Type|Description
-|-|-
`amount`|`number`|Payment amount in the smallest currency unit (e.g., for ₹295, use 29500)
`payment_id`|`string`|Unique identifier of the payment which needs to be refunded. ID should have a pay_ prefix.
`notes`|`object` *optional*|Key-value pairs used to store additional information. A maximum of 15 key-value pairs can be included.
`receipt`|`string` *optional*|A unique identifier provided by you for your internal reference.
`speed`|`string` *optional*|The speed at which the refund is to be processed. Default is 'normal'. For instant refunds, speed is set as 'optimum'.

---
#### Tool: **`fetch_all_instant_settlements`**
Fetch all instant settlements with optional filtering, pagination, and payout details
Parameters|Type|Description
-|-|-
`count`|`number` *optional*|Number of instant settlement records to fetch (default: 10, max: 100)
`expand`|`array` *optional*|Pass this if you want to fetch payout details as part of the response for all instant settlements. Supported values: ondemand_payouts
`from`|`number` *optional*|Unix timestamp (in seconds) from when instant settlements are to be fetched
`skip`|`number` *optional*|Number of instant settlement records to skip (default: 0)
`to`|`number` *optional*|Unix timestamp (in seconds) up till when instant settlements are to be fetched

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
#### Tool: **`fetch_all_payment_links`**
Fetch all payment links with optional filtering by payment ID or reference ID.You can specify the upi_link parameter to filter by link type.
Parameters|Type|Description
-|-|-
`payment_id`|`string` *optional*|Optional: Filter by payment ID associated with payment links
`reference_id`|`string` *optional*|Optional: Filter by reference ID used when creating payment links
`upi_link`|`number` *optional*|Optional: Filter only upi links. Value should be 1 if you want only upi links, 0 for only standard linksIf not provided, all types of links will be returned

---
#### Tool: **`fetch_all_payments`**
Fetch all payments with optional filtering and pagination
Parameters|Type|Description
-|-|-
`count`|`number` *optional*|Number of payments to fetch (default: 10, max: 100)
`from`|`number` *optional*|Unix timestamp (in seconds) from when payments are to be fetched
`skip`|`number` *optional*|Number of payments to skip (default: 0)
`to`|`number` *optional*|Unix timestamp (in seconds) up till when payments are to be fetched

---
#### Tool: **`fetch_all_payouts`**
Fetch all payouts for a bank account number
Parameters|Type|Description
-|-|-
`account_number`|`string`|The account from which the payouts were done.For example, 7878780080316316
`count`|`number` *optional*|Number of payouts to be fetched. Default value is 10.Maximum value is 100. This can be used for pagination,in combination with the skip parameter
`skip`|`number` *optional*|Numbers of payouts to be skipped. Default value is 0.This can be used for pagination, in combination with count

---
#### Tool: **`fetch_all_qr_codes`**
Fetch all QR codes with optional filtering and pagination
Parameters|Type|Description
-|-|-
`count`|`number` *optional*|Number of QR Codes to be retrieved (default: 10, max: 100)
`from`|`number` *optional*|Unix timestamp, in seconds, from when QR Codes are to be retrieved
`skip`|`number` *optional*|Number of QR Codes to be skipped (default: 0)
`to`|`number` *optional*|Unix timestamp, in seconds, till when QR Codes are to be retrieved

---
#### Tool: **`fetch_all_refunds`**
Use this tool to retrieve details of all refunds. By default, only the last 10 refunds are returned.
Parameters|Type|Description
-|-|-
`count`|`number` *optional*|The number of refunds to fetch. You can fetch a maximum of 100 refunds
`from`|`number` *optional*|Unix timestamp at which the refunds were created
`skip`|`number` *optional*|The number of refunds to be skipped
`to`|`number` *optional*|Unix timestamp till which the refunds were created

---
#### Tool: **`fetch_all_settlements`**
Fetch all settlements with optional filtering and pagination
Parameters|Type|Description
-|-|-
`count`|`number` *optional*|Number of settlement records to fetch (default: 10, max: 100)
`from`|`number` *optional*|Unix timestamp (in seconds) from when settlements are to be fetched
`skip`|`number` *optional*|Number of settlement records to skip (default: 0)
`to`|`number` *optional*|Unix timestamp (in seconds) up till when settlements are to be fetched

---
#### Tool: **`fetch_instant_settlement_with_id`**
Fetch details of a specific instant settlement using its ID
Parameters|Type|Description
-|-|-
`settlement_id`|`string`|The ID of the instant settlement to fetch. ID starts with 'setlod_'

---
#### Tool: **`fetch_multiple_refunds_for_payment`**
Use this tool to retrieve multiple refunds for a payment. By default, only the last 10 refunds are returned.
Parameters|Type|Description
-|-|-
`payment_id`|`string`|Unique identifier of the payment for which refunds are to be retrieved. ID should have a pay_ prefix.
`count`|`number` *optional*|The number of refunds to fetch for the payment.
`from`|`number` *optional*|Unix timestamp at which the refunds were created.
`skip`|`number` *optional*|The number of refunds to be skipped for the payment.
`to`|`number` *optional*|Unix timestamp till which the refunds were created.

---
#### Tool: **`fetch_order`**
Fetch an order's details using its ID
Parameters|Type|Description
-|-|-
`order_id`|`string`|Unique identifier of the order to be retrieved

---
#### Tool: **`fetch_order_payments`**
Fetch all payments made for a specific order in Razorpay
Parameters|Type|Description
-|-|-
`order_id`|`string`|Unique identifier of the order for which payments should be retrieved. Order id should start with `order_`

---
#### Tool: **`fetch_payment`**
Use this tool to retrieve the details of a specific payment using its id. Amount returned is in paisa
Parameters|Type|Description
-|-|-
`payment_id`|`string`|payment_id is unique identifier of the payment to be retrieved.

---
#### Tool: **`fetch_payment_card_details`**
Use this tool to retrieve the details of the card used to make a payment. Only works for payments made using a card.
Parameters|Type|Description
-|-|-
`payment_id`|`string`|Unique identifier of the payment for which you want to retrieve card details. Must start with 'pay_'

---
#### Tool: **`fetch_payment_link`**
Fetch payment link details using it's ID. Response contains the basic details like amount, status etc. The link could be of any type(standard or UPI)
Parameters|Type|Description
-|-|-
`payment_link_id`|`string`|ID of the payment link to be fetched(ID should have a plink_ prefix).

---
#### Tool: **`fetch_payments_for_qr_code`**
Fetch all payments made on a QR code
Parameters|Type|Description
-|-|-
`qr_code_id`|`string`|The unique identifier of the QR Code to fetch payments forThe QR code id should start with 'qr_'
`count`|`number` *optional*|Number of payments to be fetched (default: 10, max: 100)
`from`|`number` *optional*|Unix timestamp, in seconds, from when payments are to be retrieved
`skip`|`number` *optional*|Number of records to be skipped while fetching the payments
`to`|`number` *optional*|Unix timestamp, in seconds, till when payments are to be fetched

---
#### Tool: **`fetch_payout_with_id`**
Fetch a payout's details using its ID
Parameters|Type|Description
-|-|-
`payout_id`|`string`|The unique identifier of the payout. For example, 'pout_00000000000001'

---
#### Tool: **`fetch_qr_code`**
Fetch a QR code's details using it's ID
Parameters|Type|Description
-|-|-
`qr_code_id`|`string`|Unique identifier of the QR Code to be retrievedThe QR code id should start with 'qr_'

---
#### Tool: **`fetch_qr_codes_by_customer_id`**
Fetch all QR codes for a specific customer
Parameters|Type|Description
-|-|-
`customer_id`|`string`|The unique identifier of the customer

---
#### Tool: **`fetch_qr_codes_by_payment_id`**
Fetch all QR codes for a specific payment
Parameters|Type|Description
-|-|-
`payment_id`|`string`|The unique identifier of the paymentThe payment id always should start with 'pay_'

---
#### Tool: **`fetch_refund`**
Use this tool to retrieve the details of a specific refund using its id.
Parameters|Type|Description
-|-|-
`refund_id`|`string`|Unique identifier of the refund which is to be retrieved. ID should have a rfnd_ prefix.

---
#### Tool: **`fetch_settlement_recon_details`**
Fetch settlement reconciliation report for a specific time period
Parameters|Type|Description
-|-|-
`month`|`number`|Month for which the settlement report is requested (MM format)
`year`|`number`|Year for which the settlement report is requested (YYYY format)
`count`|`number` *optional*|Optional: Number of records to fetch (default: 10, max: 100)
`day`|`number` *optional*|Optional: Day for which the settlement report is requested (DD format)
`skip`|`number` *optional*|Optional: Number of records to skip for pagination

---
#### Tool: **`fetch_settlement_with_id`**
Fetch details of a specific settlement using its ID
Parameters|Type|Description
-|-|-
`settlement_id`|`string`|The ID of the settlement to fetch.ID starts with the 'setl_'

---
#### Tool: **`fetch_specific_refund_for_payment`**
Use this tool to retrieve details of a specific refund made for a payment.
Parameters|Type|Description
-|-|-
`payment_id`|`string`|Unique identifier of the payment for which the refund has been made. ID should have a pay_ prefix.
`refund_id`|`string`|Unique identifier of the refund to be retrieved. ID should have a rfnd_ prefix.

---
#### Tool: **`payment_link_notify`**
Send or resend notification for a payment link via SMS or email.
Parameters|Type|Description
-|-|-
`medium`|`string`|Medium through which to send the notification. Must be either 'sms' or 'email'.
`payment_link_id`|`string`|ID of the payment link for which to send notification (ID should have a plink_ prefix).

---
#### Tool: **`payment_link_upi.create`**
Create a new UPI payment link in Razorpay with a specified amount and additional options.
Parameters|Type|Description
-|-|-
`amount`|`number`|Amount to be paid using the link in smallest currency unit(e.g., ₹300, use 30000), Only accepted currency is INR
`currency`|`string`|Three-letter ISO code for the currency (e.g., INR). UPI links are only supported in INR
`accept_partial`|`boolean` *optional*|Indicates whether customers can make partial payments using the Payment Link. Default: false
`callback_method`|`string` *optional*|HTTP method for callback redirection. Must be 'get' if callback_url is set.
`callback_url`|`string` *optional*|If specified, adds a redirect URL to the Payment Link. Customer will be redirected here after payment.
`customer_contact`|`string` *optional*|Contact number of the customer.
`customer_email`|`string` *optional*|Email address of the customer.
`customer_name`|`string` *optional*|Name of the customer.
`description`|`string` *optional*|A brief description of the Payment Link explaining the intent of the payment.
`expire_by`|`number` *optional*|Timestamp, in Unix, when the Payment Link will expire. By default, a Payment Link will be valid for six months.
`first_min_partial_amount`|`number` *optional*|Minimum amount that must be paid by the customer as the first partial payment. Default value is 100.
`notes`|`object` *optional*|Key-value pairs that can be used to store additional information. Maximum 15 pairs, each value limited to 256 characters.
`notify_email`|`boolean` *optional*|Send email notifications for the Payment Link.
`notify_sms`|`boolean` *optional*|Send SMS notifications for the Payment Link.
`reference_id`|`string` *optional*|Reference number tagged to a Payment Link. Must be unique for each Payment Link. Max 40 characters.
`reminder_enable`|`boolean` *optional*|Enable payment reminders for the Payment Link.

---
#### Tool: **`update_order`**
Use this tool to update the notes for a specific order. Only the notes field can be modified.
Parameters|Type|Description
-|-|-
`notes`|`object`|Key-value pairs used to store additional information about the order. A maximum of 15 key-value pairs can be included, with each value not exceeding 256 characters.
`order_id`|`string`|Unique identifier of the order which needs to be updated. ID should have an order_ prefix.

---
#### Tool: **`update_payment`**
Use this tool to update the notes field of a payment. Notes are key-value pairs that can be used to store additional information.
Parameters|Type|Description
-|-|-
`notes`|`object`|Key-value pairs that can be used to store additional information about the payment. Values must be strings or integers.
`payment_id`|`string`|Unique identifier of the payment to be updated. Must start with 'pay_'

---
#### Tool: **`update_payment_link`**
Update any existing standard or UPI payment link with new details such as reference ID, expiry date, or notes.
Parameters|Type|Description
-|-|-
`payment_link_id`|`string`|ID of the payment link to update (ID should have a plink_ prefix).
`accept_partial`|`boolean` *optional*|Allow customers to make partial payments. Not allowed with UPI payment links.
`expire_by`|`number` *optional*|Timestamp, in Unix format, when the payment link should expire.
`notes`|`object` *optional*|Key-value pairs for additional information. Maximum 15 pairs, each value limited to 256 characters.
`reference_id`|`string` *optional*|Adds a unique reference number to the payment link.
`reminder_enable`|`boolean` *optional*|Enable or disable reminders for the payment link.

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

# armor-crypto MCP Server

The MCP server for interacting with Blockchain, Swaps, Strategic Planning and more.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [armorwallet](https://github.com/armorwallet) |
| **Repository** | https://github.com/armorwallet/armor-crypto-mcp |
| **Dockerfile** | https://github.com/armorwallet/armor-crypto-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | GNU General Public License v3.0 |

## Tools Summary

 1. **`add_wallets_to_group`**: Add wallets to a specified group.

    Expects the group name and a list of wallet names, returns a list of AddWalletToGroupResponse.
 1. **`archive_wallet_group`**: Archive wallet groups.

    Expects a list of group names, returns a list of GroupArchiveOrUnarchiveResponse.
 1. **`archive_wallets`**: Archive wallets.

    Expects a list of wallet names, returns a list of WalletArchiveOrUnarchiveResponse.
 1. **`calculate_token_conversion`**: Perform token conversion quote between two tokens. Good for quickly calculating market prices.

    Expects a ConversionRequestContainer, returns a list of ConversionResponse.
 1. **`calculator`**: Safely evaluates a mathematical or statistical expression string using Python syntax.

    Supports arithmetic operations (+, -, *, /, **, %, //), list expressions, and a range of math and statistics functions: 
    abs, round, min, max, len, sum, mean, median, stdev, variance, sin, cos, tan, sqrt, log, exp, floor, ceil, etc.

    Custom variables can be passed via the 'variables' dict, including lists for time series data.
 1. **`cancel_dca_order`**: Create a DCA order.

    Note: Make a single or multiple dca_order_requests
 1. **`cancel_order`**: Cancel a limit or stop loss order.

    Expects a CancelOrderRequestContainer, returns a CancelOrderResponseContainer.
 1. **`create_dca_order`**: Create a DCA order.

    Expects a DCAOrderRequestContainer, returns a list of DCAOrderResponse.
 1. **`create_groups`**: Create new wallet groups.

    Expects a list of group names, returns a list of CreateGroupResponse.
 1. **`create_order`**: Create a order. Can be a limit or stop loss order

    Expects a CreateOrderRequestContainer, returns a CreateOrderResponseContainer.
 1. **`create_wallet`**: Create new wallets.

    Expects a list of wallet names, returns a list of WalletInfo.
 1. **`get_all_orders`**: Retrieve all limit and stop loss orders.

    Returns a list of orders.
 1. **`get_all_wallets`**: Retrieve all wallets with balances.

    Returns a list of Wallets and asssets
 1. **`get_armor_mcp_version`**: Get the current Armor Wallet version
 1. **`get_candle_sticks`**: Get the candle sticks.

    Expects a CandleStickRequest, returns a list of candle sticks.
 1. **`get_stake_balances`**: Get the balance of staked SOL (jupSOL).

    Returns a StakeBalanceResponse.
 1. **`get_token_details`**: Retrieve token details.

    Expects a TokenDetailsRequestContainer, returns a list of TokenDetailsResponse.
 1. **`get_top_trending_tokens`**: Get the top trending tokens in a particular time frame. Great for comparing market cap or volume.

    Expects a TopTrendingTokensRequest, returns a list of tokens with their details.
 1. **`get_wallet_token_balance`**: Get the balance for a list of wallet/token pairs.

    Expects a WalletTokenPairsContainer, returns a list of WalletTokenBalance.
 1. **`list_dca_orders`**: List all DCA orders.

    Returns a list of DCAOrderResponse.
 1. **`list_groups`**: List all wallet groups.

    Returns a list of GroupInfo.
 1. **`list_single_group`**: Retrieve details for a single wallet group.

    Expects the group name as a parameter, returns SingleGroupInfo.
 1. **`remove_wallets_from_group`**: Remove wallets from a specified group.

    Expects the group name and a list of wallet names, returns a list of RemoveWalletFromGroupResponse.
 1. **`rename_wallets`**: Rename wallets.

    Expects a RenameWalletRequestContainer, returns a list.
 1. **`stake_quote`**: Retrieve a stake quote.

    Expects a StakeQuoteRequestContainer, returns a SwapQuoteRequestContainer.
 1. **`stake_transaction`**: Execute a stake transaction.

    Expects a StakeTransactionRequestContainer, returns a SwapTransactionRequestContainer.
 1. **`swap_quote`**: Retrieve a swap quote.

    Expects a SwapQuoteRequestContainer, returns a list of SwapQuoteResponse.
 1. **`swap_transaction`**: Execute a swap transaction.

    Expects a SwapTransactionRequestContainer, returns a list of SwapTransactionResponse.
 1. **`transfer_tokens`**: Transfer tokens from one wallet to another.

    Expects a TransferTokensRequestContainer, returns a list of TransferTokenResponse.
 1. **`unarchive_wallet_group`**: Unarchive wallet groups.

    Expects a list of group names, returns a list of GroupArchiveOrUnarchiveResponse.
 1. **`unarchive_wallets`**: Unarchive wallets.

    Expects a list of wallet names, returns a list of WalletArchiveOrUnarchiveResponse.
 1. **`unstake_quote`**: Retrieve an unstake quote.

    Expects a UnstakeQuoteRequestContainer, returns a SwapQuoteRequestContainer.
 1. **`unstake_transaction`**: Execute an unstake transaction.

    Expects a UnstakeTransactionRequestContainer, returns a SwapTransactionRequestContainer.
 1. **`wait_a_moment`**: Wait for some short amount of time, no more than 10 seconds

## Tools

### Tool: **`add_wallets_to_group`**

Add wallets to a specified group.

    Expects the group name and a list of wallet names, returns a list of AddWalletToGroupResponse.

| Parameter | Type | Description |
| - | - | - |
| `add_wallet_to_group_requests` | `string` |  |

### Tool: **`archive_wallet_group`**

Archive wallet groups.

    Expects a list of group names, returns a list of GroupArchiveOrUnarchiveResponse.

| Parameter | Type | Description |
| - | - | - |
| `archive_wallet_group_requests` | `string` |  |

### Tool: **`archive_wallets`**

Archive wallets.

    Expects a list of wallet names, returns a list of WalletArchiveOrUnarchiveResponse.

| Parameter | Type | Description |
| - | - | - |
| `archive_wallet_requests` | `string` |  |

### Tool: **`calculate_token_conversion`**

Perform token conversion quote between two tokens. Good for quickly calculating market prices.

    Expects a ConversionRequestContainer, returns a list of ConversionResponse.

| Parameter | Type | Description |
| - | - | - |
| `conversion_requests` | `string` |  |

### Tool: **`calculator`**

Safely evaluates a mathematical or statistical expression string using Python syntax.

    Supports arithmetic operations (+, -, *, /, **, %, //), list expressions, and a range of math and statistics functions: 
    abs, round, min, max, len, sum, mean, median, stdev, variance, sin, cos, tan, sqrt, log, exp, floor, ceil, etc.

    Custom variables can be passed via the 'variables' dict, including lists for time series data.

| Parameter | Type | Description |
| - | - | - |
| `expression` | `string` |  |
| `variables` | `object` |  |

### Tool: **`cancel_dca_order`**

Create a DCA order.

    Note: Make a single or multiple dca_order_requests

| Parameter | Type | Description |
| - | - | - |
| `cancel_dca_order_requests` | `string` |  |

### Tool: **`cancel_order`**

Cancel a limit or stop loss order.

    Expects a CancelOrderRequestContainer, returns a CancelOrderResponseContainer.

| Parameter | Type | Description |
| - | - | - |
| `cancel_order_requests` | `string` |  |

### Tool: **`create_dca_order`**

Create a DCA order.

    Expects a DCAOrderRequestContainer, returns a list of DCAOrderResponse.

| Parameter | Type | Description |
| - | - | - |
| `dca_order_requests` | `string` |  |

### Tool: **`create_groups`**

Create new wallet groups.

    Expects a list of group names, returns a list of CreateGroupResponse.

| Parameter | Type | Description |
| - | - | - |
| `create_groups_requests` | `string` |  |

### Tool: **`create_order`**

Create a order. Can be a limit or stop loss order

    Expects a CreateOrderRequestContainer, returns a CreateOrderResponseContainer.

| Parameter | Type | Description |
| - | - | - |
| `create_order_requests` | `string` |  |

### Tool: **`create_wallet`**

Create new wallets.

    Expects a list of wallet names, returns a list of WalletInfo.

| Parameter | Type | Description |
| - | - | - |
| `create_wallet_requests` | `string` |  |

### Tool: **`get_all_orders`**

Retrieve all limit and stop loss orders.

    Returns a list of orders.

| Parameter | Type | Description |
| - | - | - |
| `get_all_orders_requests` | `string` |  |

### Tool: **`get_all_wallets`**

Retrieve all wallets with balances.

    Returns a list of Wallets and asssets

| Parameter | Type | Description |
| - | - | - |
| `get_all_wallets_requests` | `string` |  |

### Tool: **`get_armor_mcp_version`**

Get the current Armor Wallet version

### Tool: **`get_candle_sticks`**

Get the candle sticks.

    Expects a CandleStickRequest, returns a list of candle sticks.

| Parameter | Type | Description |
| - | - | - |
| `candle_stick_requests` | `string` |  |

### Tool: **`get_stake_balances`**

Get the balance of staked SOL (jupSOL).

    Returns a StakeBalanceResponse.

### Tool: **`get_token_details`**

Retrieve token details.

    Expects a TokenDetailsRequestContainer, returns a list of TokenDetailsResponse.

| Parameter | Type | Description |
| - | - | - |
| `token_details_requests` | `string` |  |

### Tool: **`get_top_trending_tokens`**

Get the top trending tokens in a particular time frame. Great for comparing market cap or volume.

    Expects a TopTrendingTokensRequest, returns a list of tokens with their details.

| Parameter | Type | Description |
| - | - | - |
| `top_trending_tokens_requests` | `string` |  |

### Tool: **`get_wallet_token_balance`**

Get the balance for a list of wallet/token pairs.

    Expects a WalletTokenPairsContainer, returns a list of WalletTokenBalance.

| Parameter | Type | Description |
| - | - | - |
| `wallet_token_pairs` | `string` |  |

### Tool: **`list_dca_orders`**

List all DCA orders.

    Returns a list of DCAOrderResponse.

| Parameter | Type | Description |
| - | - | - |
| `list_dca_order_requests` | `string` |  |

### Tool: **`list_groups`**

List all wallet groups.

    Returns a list of GroupInfo.

### Tool: **`list_single_group`**

Retrieve details for a single wallet group.

    Expects the group name as a parameter, returns SingleGroupInfo.

| Parameter | Type | Description |
| - | - | - |
| `list_single_group_requests` | `string` |  |

### Tool: **`remove_wallets_from_group`**

Remove wallets from a specified group.

    Expects the group name and a list of wallet names, returns a list of RemoveWalletFromGroupResponse.

| Parameter | Type | Description |
| - | - | - |
| `remove_wallets_from_group_requests` | `string` |  |

### Tool: **`rename_wallets`**

Rename wallets.

    Expects a RenameWalletRequestContainer, returns a list.

| Parameter | Type | Description |
| - | - | - |
| `rename_wallet_requests` | `string` |  |

### Tool: **`stake_quote`**

Retrieve a stake quote.

    Expects a StakeQuoteRequestContainer, returns a SwapQuoteRequestContainer.

| Parameter | Type | Description |
| - | - | - |
| `stake_quote_requests` | `string` |  |

### Tool: **`stake_transaction`**

Execute a stake transaction.

    Expects a StakeTransactionRequestContainer, returns a SwapTransactionRequestContainer.

| Parameter | Type | Description |
| - | - | - |
| `stake_transaction_requests` | `string` |  |

### Tool: **`swap_quote`**

Retrieve a swap quote.

    Expects a SwapQuoteRequestContainer, returns a list of SwapQuoteResponse.

| Parameter | Type | Description |
| - | - | - |
| `swap_quote_requests` | `string` |  |

### Tool: **`swap_transaction`**

Execute a swap transaction.

    Expects a SwapTransactionRequestContainer, returns a list of SwapTransactionResponse.

| Parameter | Type | Description |
| - | - | - |
| `swap_transaction_requests` | `string` |  |

### Tool: **`transfer_tokens`**

Transfer tokens from one wallet to another.

    Expects a TransferTokensRequestContainer, returns a list of TransferTokenResponse.

| Parameter | Type | Description |
| - | - | - |
| `transfer_tokens_requests` | `string` |  |

### Tool: **`unarchive_wallet_group`**

Unarchive wallet groups.

    Expects a list of group names, returns a list of GroupArchiveOrUnarchiveResponse.

| Parameter | Type | Description |
| - | - | - |
| `unarchive_wallet_group_requests` | `string` |  |

### Tool: **`unarchive_wallets`**

Unarchive wallets.

    Expects a list of wallet names, returns a list of WalletArchiveOrUnarchiveResponse.

| Parameter | Type | Description |
| - | - | - |
| `unarchive_wallet_requests` | `string` |  |

### Tool: **`unstake_quote`**

Retrieve an unstake quote.

    Expects a UnstakeQuoteRequestContainer, returns a SwapQuoteRequestContainer.

| Parameter | Type | Description |
| - | - | - |
| `unstake_quote_requests` | `string` |  |

### Tool: **`unstake_transaction`**

Execute an unstake transaction.

    Expects a UnstakeTransactionRequestContainer, returns a SwapTransactionRequestContainer.

| Parameter | Type | Description |
| - | - | - |
| `unstake_transaction_requests` | `string` |  |

### Tool: **`wait_a_moment`**

Wait for some short amount of time, no more than 10 seconds

| Parameter | Type | Description |
| - | - | - |
| `seconds` | `number` |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "armor-crypto": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "ARMOR_API_URL"
        "-e"
        "ARMOR_API_KEY"
        "mcp/armor-crypto"
      ],
      "env": {
        "ARMOR_API_URL": "https://app.armorwallet.ai/api/v1",
        "ARMOR_API_KEY": "<PUT-YOUR-KEY-HERE>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/armor-crypto -f Dockerfile https://github.com/armorwallet/armor-crypto-mcp.git
```


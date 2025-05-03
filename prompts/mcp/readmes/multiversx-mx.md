# MultiversX MCP Server

MCP Server for MultiversX.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/multiversx-mx](https://hub.docker.com/repository/docker/mcp/multiversx-mx)
**Author**|[multiversx](https://github.com/multiversx)
**Repository**|https://github.com/multiversx/mx-mcp
**Dockerfile**|https://github.com/multiversx/mx-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/multiversx-mx)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/multiversx-mx --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Other

## Available Tools
Tools provided by this Server|Short Description
-|-
`create-sft-nft-mesdt-tokens`|Create a transaction to issue a semi-fungible token (SFT), or a non-fungible token (NFT), or a MetaESDT token for a collection and send it.|
`create-wallet`|Create a new wallet and save it as a PEM file.|
`get-balance-of-address`|Get the balance for a MultiversX address|
`get-network`|Get the network set in the environment config|
`get-tokens-of-address`|Get the tokens of an address.|
`get-wallet-address`|Get the bech32 address of the wallet set in the environment config|
`issue-fungible-token`|Create a transaction to issue a fungible token and send it.|
`issue-meta-esdt-collection`|Create a transaction to issue a MetaESDT token collection (MESDT) and send it.|
`issue-nft-collection`|Create a transaction to issue a non-fungible token collection (NFT) and send it.|
`issue-semi-fungible-collection`|Create a transaction to issue a semi-fungible collection (SFT) and send it.|
`send-egld`|Create a move balance transaction and send it.|
`send-egld-to-multiple-receivers`|Create move balance transactions and send them.|
`send-fungible-tokens`|Create a fungible token transfer transaction and send it.|
`send-sft-nft-meta-tokens`|Create a nft, sft or meta esdt transfer transaction and send it.|

---
## Tools Details

#### Tool: **`create-sft-nft-mesdt-tokens`**
Create a transaction to issue a semi-fungible token (SFT), or a non-fungible token (NFT), or a MetaESDT token for a collection and send it.
Please also specify the initial quantity and the royalties.
Parameters|Type|Description
-|-|-
`initialQuantity`|`string`|The initial quantity(number of tokens) that will be minted. If not provided, defaults to 1.
`name`|`string`|The name of the token.
`tokenIdentifier`|`string`|The identifier of the collection.
`royalties`|`string` *optional*|The royalties you'll receive.

---
#### Tool: **`create-wallet`**
Create a new wallet and save it as a PEM file. PEM file ARE NOT SECURE. If a wallet already exists, will abort operation.
#### Tool: **`get-balance-of-address`**
Get the balance for a MultiversX address
Parameters|Type|Description
-|-|-
`address`|`string`|The bech32 representation of the address

---
#### Tool: **`get-network`**
Get the network set in the environment config
#### Tool: **`get-tokens-of-address`**
Get the tokens of an address. Returns the first 25 fungible tokens and the first 25 NFTs, SFTs and MetaESDT. To get more tokens, specify the number of tokens you want to get. Will return the specified number of fungible tokens and the same number of non-fungible. The returned list will contain twice the number of tokens specified, if tokens are available.
Parameters|Type|Description
-|-|-
`address`|`string`|The bech32 address of the account (erd1...)
`size`|`number` *optional*|The number of each token type to be returned. By default, the number is 25.

---
#### Tool: **`get-wallet-address`**
Get the bech32 address of the wallet set in the environment config
#### Tool: **`issue-fungible-token`**
Create a transaction to issue a fungible token and send it. Will issue the token with the specified arguments. All the properties will be set to true.
Parameters|Type|Description
-|-|-
`initialSupply`|`string`|The initial supply that will be minted.
`numDecimals`|`string`|The number of decimals the token will have.
`tokenName`|`string`|The token name.
`tokenTicker`|`string`|The token ticker.

---
#### Tool: **`issue-meta-esdt-collection`**
Create a transaction to issue a MetaESDT token collection (MESDT) and send it. Will issue the collection with the specified arguments. All the properties will be set to true.
Parameters|Type|Description
-|-|-
`numDecimals`|`string`|The number of decimals.
`tokenName`|`string`|The token name.
`tokenTicker`|`string`|The token ticker.

---
#### Tool: **`issue-nft-collection`**
Create a transaction to issue a non-fungible token collection (NFT) and send it. Will issue the collection with the specified arguments. All the properties will be set to true.
Parameters|Type|Description
-|-|-
`tokenName`|`string`|The token name.
`tokenTicker`|`string`|The token ticker.

---
#### Tool: **`issue-semi-fungible-collection`**
Create a transaction to issue a semi-fungible collection (SFT) and send it. Will issue the collection with the specified arguments. All the properties will be set to true.
Parameters|Type|Description
-|-|-
`tokenName`|`string`|The token name.
`tokenTicker`|`string`|The token ticker.

---
#### Tool: **`send-egld`**
Create a move balance transaction and send it. Will send EGLD using the wallet set in the env to the specified receiver.
Parameters|Type|Description
-|-|-
`amount`|`string`|The amount of EGLD to send. This amount will then be denominated (1 EGLD=1000000000000000000)
`receiver`|`string`|The bech32 address of the receiver (erd1...)

---
#### Tool: **`send-egld-to-multiple-receivers`**
Create move balance transactions and send them. Will send EGLD using the wallet set in the env to each specified receiver.
Parameters|Type|Description
-|-|-
`amount`|`string`|The amount of EGLD to send. This amount will then be denominated (1 EGLD=1000000000000000000)
`receivers`|`array`|An array of bech32 addresses of the receivers (erd1...)

---
#### Tool: **`send-fungible-tokens`**
Create a fungible token transfer transaction and send it. Will send the specified token using the wallet set in the env to the specified receiver.
Parameters|Type|Description
-|-|-
`amount`|`string`|The amount to send. This amount will then be denominated.
`receiver`|`string`|The bech32 address of the receiver (erd1...)
`token`|`string`|The identifier of the token to send.

---
#### Tool: **`send-sft-nft-meta-tokens`**
Create a nft, sft or meta esdt transfer transaction and send it. Will send the specified token using the wallet set in the env to the specified receiver.
Parameters|Type|Description
-|-|-
`receiver`|`string`|The bech32 address of the receiver (erd1...)
`token`|`string`|The extended identifier of the token to send (e.g. NFTEST-123456-0a).
`amount`|`string` *optional*|The amount of tokens to send. ONLY needed for SFT or Meta-ESDT.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "multiversx-mx": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "MVX_NETWORK",
        "-e",
        "MVX_WALLET",
        "mcp/multiversx-mx"
      ],
      "env": {
        "MVX_NETWORK": "devnet",
        "MVX_WALLET": "absolute/path/to/someWallet.pem"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

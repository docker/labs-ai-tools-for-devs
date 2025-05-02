# TweetBinder MCP Server

TweetBinder MCP Server is a server based on the Model Context Protocol (MCP) that allows Claude and other MCP-compatible clients to interact with your TweetBinder by Audiense account.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/tweetbinder](https://hub.docker.com/repository/docker/mcp/tweetbinder)
**Author**|[AudienseCo](https://github.com/AudienseCo)
**Repository**|https://github.com/audienseco/mcp-tweetbinder
**Dockerfile**|https://github.com/audienseco/mcp-tweetbinder/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/tweetbinder)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/tweetbinder --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`create-twitter-count`|Creates a new report that counts tweets matching a search query.|
`create-twitter-report`|Creates a new report that analyzes Twitter/X data based on a search query.|
`get-account-balances`|Retrieves information about your account's credit balance, usage, and remaining quota.|
`get-report-content`|Retrieves the content (tweets or users) of a TweetBinder report.|
`get-report-stats`|Retrieves comprehensive statistics and analytics for a TweetBinder report.|
`get-report-status`|Checks the current status of a TweetBinder report.|
`list-reports`|Retrieves a list of all your TweetBinder reports.|

---
## Tools Details

#### Tool: **`create-twitter-count`**
Creates a new report that counts tweets matching a search query. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`query`|`string`|The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc.
`reportType`|`string` *optional*|Type of report to create: '7-day' for last week or 'historical' for all time.

---
#### Tool: **`create-twitter-report`**
Creates a new report that analyzes Twitter/X data based on a search query. The report provides statistics and tweet data. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`query`|`string`|The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc.
`endDate`|`number` *optional*|End date as Unix timestamp (seconds since epoch).
`limit`|`number` *optional*|Maximum number of tweets to retrieve (up to 50,000).
`reportType`|`string` *optional*|Type of report to create: '7-day' for last week or 'historical' for all time.
`startDate`|`number` *optional*|Start date as Unix timestamp (seconds since epoch).

---
#### Tool: **`get-account-balances`**
Retrieves information about your account's credit balance, usage, and remaining quota. Returns raw JSON response.
#### Tool: **`get-report-content`**
Retrieves the content (tweets or users) of a TweetBinder report. The report must be in 'Generated' status. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`contentType`|`string`|The type of content to retrieve: 'tweets' for tweet IDs or 'users' for user IDs.
`reportId`|`string`|The ID of the report to retrieve content for.
`filter`|`string` *optional*|JSON string with filter criteria. Example: '{"counts.favorites":{"$gt":10}}'
`page`|`number` *optional*|Page number for pagination. Starts at 1.
`perPage`|`number` *optional*|Number of items per page (default varies by endpoint).
`sortBy`|`string` *optional*|Field to sort by (e.g., 'createdAt', 'counts.favorites').
`sortDirection`|`string` *optional*|Sort direction: '1' for ascending, '-1' for descending.

---
#### Tool: **`get-report-stats`**
Retrieves comprehensive statistics and analytics for a TweetBinder report. The report must be in 'Generated' status to access statistics. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`reportId`|`string`|The ID of the report to retrieve statistics for.

---
#### Tool: **`get-report-status`**
Checks the current status of a TweetBinder report. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`reportId`|`string`|The ID of the report to check.

---
#### Tool: **`list-reports`**
Retrieves a list of all your TweetBinder reports. Reports can be sorted by different fields. Returns raw JSON response.
Parameters|Type|Description
-|-|-
`order`|`string` *optional*|Optional sorting parameter in the format 'field|direction'. Example: 'createdAt|-1' for newest first, 'createdAt|1' for oldest first.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "tweetbinder": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TWEETBINDER_API_TOKEN",
        "mcp/tweetbinder"
      ],
      "env": {
        "TWEETBINDER_API_TOKEN": "your-bearer-token-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

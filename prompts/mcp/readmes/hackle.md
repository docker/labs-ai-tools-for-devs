# Hackle MCP Server

Model Context Protocol server for Hackle.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/hackle](https://hub.docker.com/repository/docker/mcp/hackle)
**Author**|[hackle-io](https://github.com/hackle-io)
**Repository**|https://github.com/hackle-io/hackle-mcp
**Dockerfile**|https://github.com/hackle-io/hackle-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/hackle)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`active-user-series`|Retrieves time-series data of active users.|
`experiment-detail`|Retrieves detailed information for a specific A/B test experiment.|
`experiment-list`|Fetches a paginated list of A/B test experiments with search functionality.|
`in-app-message-detail`|Retrieves detailed information for a specific in-app message.|
`in-app-message-list`|Fetches a paginated list of in-app messages with search functionality.|
`push-message-detail`|Retrieves detailed information for a specific push message.|
`push-message-list`|Fetches a paginated list of push messages with search functionality.|
`retention-series`|Retrieves time-series data of user retention.|
`stickiness-series`|Retrieves time-series data of user stickiness (return visit frequency).|

---
## Tools Details

#### Tool: **`active-user-series`**
Retrieves time-series data of active users. Available in daily, weekly, and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|

---
#### Tool: **`experiment-detail`**
Retrieves detailed information for a specific A/B test experiment.
Parameters|Type|Description
-|-|-
`experimentId`|`number`|

---
#### Tool: **`experiment-list`**
Fetches a paginated list of A/B test experiments with search functionality.
Parameters|Type|Description
-|-|-
`pageNumber`|`number`|
`pageSize`|`number`|
`searchKeyword`|`string` *optional*|

---
#### Tool: **`in-app-message-detail`**
Retrieves detailed information for a specific in-app message.
Parameters|Type|Description
-|-|-
`inAppMessageId`|`number`|

---
#### Tool: **`in-app-message-list`**
Fetches a paginated list of in-app messages with search functionality.
Parameters|Type|Description
-|-|-
`pageNumber`|`number`|
`pageSize`|`number`|
`searchKeyword`|`string` *optional*|

---
#### Tool: **`push-message-detail`**
Retrieves detailed information for a specific push message.
Parameters|Type|Description
-|-|-
`pushMessageId`|`number`|

---
#### Tool: **`push-message-list`**
Fetches a paginated list of push messages with search functionality.
Parameters|Type|Description
-|-|-
`pageNumber`|`number`|
`pageSize`|`number`|
`searchKeyword`|`string` *optional*|

---
#### Tool: **`retention-series`**
Retrieves time-series data of user retention. Available in daily, weekly, and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|

---
#### Tool: **`stickiness-series`**
Retrieves time-series data of user stickiness (return visit frequency). Available in weekly and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "hackle": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY",
        "mcp/hackle"
      ],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

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
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/hackle --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`active-user-series`|Retrieves time-series data of active users.|
`analytics-chart-detail`|fetch analytics chart detail.|
`analytics-chart-list`|fetch data analytics chart list.|
`data-report-detail`|fetch data report detail.|
`data-report-list`|fetch data report list.|
`experiment-detail`|Retrieves detailed information for a specific A/B test experiment.|
`experiment-list`|Fetches a paginated list of A/B test experiments with search functionality.|
`in-app-message-detail`|Retrieves detailed information for a specific in-app message.|
`in-app-message-list`|Fetches a paginated list of in-app messages with search functionality.|
`push-message-detail`|Retrieves detailed information for a specific push message.|
`push-message-list`|Fetches a paginated list of push messages with search functionality.|
`remote-config-detail`|Fetch remote config detail.|
`remote-config-list`|Fetch Remote Config list.|
`retention-series`|Retrieves time-series data of user retention.|
`stickiness-series`|Retrieves time-series data of user stickiness (return visit frequency).|

---
## Tools Details

#### Tool: **`active-user-series`**
Retrieves time-series data of active users. Available in daily, weekly, and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|End date in YYYY-MM-DD format.

---
#### Tool: **`analytics-chart-detail`**
fetch analytics chart detail. You can visualize the chart using this tool's result.
Parameters|Type|Description
-|-|-
`chartId`|`number`|Chart id
`chartType`|`string`|Type of the chart. Will throw an error if given chartId's chart type is different from chartType.

---
#### Tool: **`analytics-chart-list`**
fetch data analytics chart list.
Parameters|Type|Description
-|-|-
`chartType`|`string` *optional*|
`pageNumber`|`number` *optional*|
`pageSize`|`number` *optional*|
`searchKeyword`|`string` *optional*|

---
#### Tool: **`data-report-detail`**
fetch data report detail.
Parameters|Type|Description
-|-|-
`dataReportId`|`number`|

---
#### Tool: **`data-report-list`**
fetch data report list.
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
`pageNumber`|`number` *optional*|
`pageSize`|`number` *optional*|
`searchKeyword`|`string` *optional*|name, description, or experimentKey of an experiment.

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
`pageNumber`|`number` *optional*|
`pageSize`|`number` *optional*|
`searchKeyword`|`string` *optional*|name, description, or campaignKey of an in-app message.

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
`pageNumber`|`number` *optional*|
`pageSize`|`number` *optional*|
`searchKeyword`|`string` *optional*|name, description, or campaignKey of a push message.

---
#### Tool: **`remote-config-detail`**
Fetch remote config detail.
Parameters|Type|Description
-|-|-
`remoteConfigId`|`number`|Remote config's id. You can get this information by using Remote Config List Tool.

---
#### Tool: **`remote-config-list`**
Fetch Remote Config list.
Parameters|Type|Description
-|-|-
`pageNumber`|`number` *optional*|
`pageSize`|`number` *optional*|
`searchKeyword`|`string` *optional*|
`status`|`string` *optional*|

---
#### Tool: **`retention-series`**
Retrieves time-series data of user retention. Available in daily, weekly, and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|End date in YYYY-MM-DD format.

---
#### Tool: **`stickiness-series`**
Retrieves time-series data of user stickiness (return visit frequency). Available in weekly and monthly units.
Parameters|Type|Description
-|-|-
`unit`|`string`|
`date`|`string` *optional*|End date in YYYY-MM-DD format.

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

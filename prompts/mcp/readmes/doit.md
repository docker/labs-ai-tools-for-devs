# Doit MCP Server

DoiT official MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/doit](https://hub.docker.com/repository/docker/mcp/doit)
**Author**|[doitintl](https://github.com/doitintl)
**Repository**|https://github.com/doitintl/doit-mcp-server
**Dockerfile**|https://github.com/doitintl/doit-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/doit)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_anomalies`|List anomalies detected in cloud costs|
`get_anomaly`|Get a specific anomaly by ID|
`get_cloud_incident`|Get a specific cloud incident by ID|
`get_cloud_incidents`|Get cloud incidents|
`get_dimension`|Get a specific Cloud Analytics dimension by type and ID|
`get_report_results`|Get the results of a specific report by ID|
`list_dimensions`|Lists Cloud Analytics dimensions that your account has access to.|
`list_reports`|Lists Cloud Analytics reports that your account has access to|
`run_query`|Runs a report query with the specified configuration without persisting it.|
`validate_user`|Validates the current API user and returns domain and email information|

---
## Tools Details

#### Tool: **`get_anomalies`**
List anomalies detected in cloud costs
Parameters|Type|Description
-|-|-
`filter`|`string` *optional*|Filter string in format 'key:value|key:value'. Multiple values for same key are treated as OR, different keys as AND.
`pageToken`|`string` *optional*|Token for pagination. Use this to get the next page of results.

---
#### Tool: **`get_anomaly`**
Get a specific anomaly by ID
Parameters|Type|Description
-|-|-
`id`|`string`|anomaly ID

---
#### Tool: **`get_cloud_incident`**
Get a specific cloud incident by ID
Parameters|Type|Description
-|-|-
`id`|`string`|incident ID

---
#### Tool: **`get_cloud_incidents`**
Get cloud incidents
Parameters|Type|Description
-|-|-
`filter`|`string` *optional*|Filter string in format 'key:value|key:value'. Multiple values for same key are treated as OR, different keys as AND. Example: 'platform:google-cloud|status:active' or 'platform:google-cloud|platform:amazon-web-services'
`pageToken`|`string` *optional*|Token for pagination. Use this to get the next page of results.
`platform`|`string` *optional*|platform name

---
#### Tool: **`get_dimension`**
Get a specific Cloud Analytics dimension by type and ID
Parameters|Type|Description
-|-|-
`id`|`string`|Dimension id
`type`|`string`|Dimension type

---
#### Tool: **`get_report_results`**
Get the results of a specific report by ID
Parameters|Type|Description
-|-|-
`id`|`string`|The ID of the report to retrieve results for

---
#### Tool: **`list_dimensions`**
Lists Cloud Analytics dimensions that your account has access to. Use this tool to get the dimensions that you can use in the run_query tool.
Parameters|Type|Description
-|-|-
`filter`|`string` *optional*|Filter string (optional) in format 'key:value|key:value'. Multiple values for same key are treated as OR, different keys as AND. The fields eligible for filtering are: type, label, key. 
          use the filter parameter only if you know the exact value of the key, otherwise the filter should be empty.
`pageToken`|`string` *optional*|Token for pagination. Use this to get the next page of results.

---
#### Tool: **`list_reports`**
Lists Cloud Analytics reports that your account has access to
Parameters|Type|Description
-|-|-
`filter`|`string` *optional*|Filter string in format 'key:value|key:value'. Multiple values for same key are treated as OR, different keys as AND. Possible filter keys: reportName, owner, type, updateTime, use the filter property only if you know for sure the value is a valid filter key, do not guess it.
`pageToken`|`string` *optional*|Token for pagination. Use this to get the next page of results.

---
#### Tool: **`run_query`**
Runs a report query with the specified configuration without persisting it. 
    Fields that are not populated will use their default values if needed.
    Use the dimension tool before running the query to get the list of dimensions and their types.
Parameters|Type|Description
-|-|-
`config`|`object`|The configuration for the query, including dimensions, metrics, filters, etc.

---
#### Tool: **`validate_user`**
Validates the current API user and returns domain and email information
## Use this MCP Server

```json
{
  "mcpServers": {
    "doit": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DOIT_API_KEY",
        "mcp/doit"
      ],
      "env": {
        "DOIT_API_KEY": "your_doit_api_key"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

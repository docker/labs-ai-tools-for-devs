# Risken MCP Server

RISKEN's official MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/risken](https://hub.docker.com/repository/docker/mcp/risken)
**Author**|[ca-risken](https://github.com/ca-risken)
**Repository**|https://github.com/ca-risken/risken-mcp-server
**Dockerfile**|https://github.com/ca-risken/risken-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/risken)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`archive_finding`|Archive RISKEN finding.|
`get_project`|Get details of the authenticated RISKEN project.|
`search_alert`|Search RISKEN alert.|
`search_finding`|Search RISKEN findings.|

---
## Tools Details

#### Tool: **`archive_finding`**
Archive RISKEN finding. Use this when a request include "archive", "アーカイブ", "ペンディング"...
Parameters|Type|Description
-|-|-
`finding_id`|`number`|Finding ID.
`note`|`string` *optional*|Note. ex) This is no risk finding.

---
#### Tool: **`get_project`**
Get details of the authenticated RISKEN project. Use this when a request include "project", "my project", "プロジェクト"...
#### Tool: **`search_alert`**
Search RISKEN alert. Use this when a request include "alert", "アラート" ...
Parameters|Type|Description
-|-|-
`status`|`number` *optional*|Status of alert. 1: active(有効なアラート), 2: pending(保留中), 3: deactive(解決済みアラート)

---
#### Tool: **`search_finding`**
Search RISKEN findings. Use this when a request include "finding", "issue", "ファインディング", "問題"...
Parameters|Type|Description
-|-|-
`alert_id`|`number` *optional*|Alert ID.
`data_source`|`array` *optional*|RISKEN DataSource. e.g. aws, google, code (like github, gitlab, etc.), osint, diagnosis, azure, ...
`finding_id`|`number` *optional*|Finding ID.
`from_score`|`number` *optional*|Minimum score of the findings.
`limit`|`number` *optional*|Limit of the findings.
`offset`|`number` *optional*|Offset of the findings.
`resource_name`|`array` *optional*|RISKEN ResourceName. e.g. "arn:aws:iam::123456789012:user/test-user" ...
`status`|`number` *optional*|Status of the findings. (0: all, 1: active, 2: pending)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "risken": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RISKEN_URL",
        "-e",
        "RISKEN_ACCESS_TOKEN",
        "mcp/risken",
        "stdio"
      ],
      "env": {
        "RISKEN_URL": "http://localhost:8000",
        "RISKEN_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

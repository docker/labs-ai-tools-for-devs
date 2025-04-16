# Circleci MCP Server

A specialized server implementation for the Model Context Protocol (MCP) designed to integrate with CircleCI's development workflow. This project serves as a bridge between CircleCI's infrastructure and the Model Context Protocol, enabling enhanced AI-powered development experiences.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[CircleCI-Public](https://github.com/CircleCI-Public)
**Repository**|https://github.com/CircleCI-Public/mcp-server-circleci
**Dockerfile**|https://github.com/CircleCI-Public/mcp-server-circleci/blob/refs/pull/22/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`find_flaky_tests`|This tool retrieves information about flaky tests in a CircleCI project.|
`get_build_failure_logs`|This tool helps debug CircleCI build failures by retrieving failure logs.|

---
## Tools Details

#### Tool: **`find_flaky_tests`**
This tool retrieves information about flaky tests in a CircleCI project. 

    The agent receiving this output MUST analyze the flaky test data and implement appropriate fixes based on the specific issues identified.

    Input options (EXACTLY ONE of these two options must be used):

    Option 1 - Direct URL (provide ONE of these):
    - projectURL: The URL of the CircleCI project in any of these formats:
      * Project URL: https://app.circleci.com/pipelines/gh/organization/project
      * Pipeline URL: https://app.circleci.com/pipelines/gh/organization/project/123
      * Workflow URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def
      * Job URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def/jobs/xyz

    Option 2 - Project Detection (ALL of these must be provided together):
    - workspaceRoot: The absolute path to the workspace root
    - gitRemoteURL: The URL of the git remote repository

    IMPORTANT:
    - Never call this tool with incomplete parameters
    - If using Option 1, the URLs MUST be provided by the user - do not attempt to construct or guess URLs
    - If using Option 2, BOTH parameters (workspaceRoot, gitRemoteURL) must be provided
    - If neither option can be fully satisfied, ask the user for the missing information before making the tool call
Parameters|Type|Description
-|-|-
`params`|`object`|

---
#### Tool: **`get_build_failure_logs`**
This tool helps debug CircleCI build failures by retrieving failure logs.

    Input options (EXACTLY ONE of these two options must be used):

    Option 1 - Direct URL (provide ONE of these):
    - projectURL: The URL of the CircleCI project in any of these formats:
      * Project URL: https://app.circleci.com/pipelines/gh/organization/project
      * Pipeline URL: https://app.circleci.com/pipelines/gh/organization/project/123
      * Workflow URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def
      * Job URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def/jobs/xyz

    Option 2 - Project Detection (ALL of these must be provided together):
    - workspaceRoot: The absolute path to the workspace root
    - gitRemoteURL: The URL of the git remote repository
    - branch: The name of the current branch

    IMPORTANT:
    - Never call this tool with incomplete parameters
    - If using Option 1, the URLs MUST be provided by the user - do not attempt to construct or guess URLs
    - If using Option 2, ALL THREE parameters (workspaceRoot, gitRemoteURL, branch) must be provided
    - If neither option can be fully satisfied, ask the user for the missing information before making the tool call
Parameters|Type|Description
-|-|-
`params`|`object`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "circleci": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CIRCLECI_BASE_URL",
        "-e",
        "CIRCLECI_TOKEN",
        "mcp/circleci"
      ],
      "env": {
        "CIRCLECI_BASE_URL": "https://circleci.com",
        "CIRCLECI_TOKEN": "your-circleci-token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

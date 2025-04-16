# Pulumi MCP Server

Pulumi MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[pulumi](https://github.com/pulumi)
**Repository**|https://github.com/pulumi/mcp-server
**Dockerfile**|https://github.com/pulumi/mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`pulumi-cli-preview`|Run pulumi preview for a given project and stack|
`pulumi-cli-stack-output`|Get the output value(s) of a given stack|
`pulumi-cli-up`|Run pulumi up for a given project and stack|
`pulumi-registry-get-resource`|Get information about a specific resource from the Pulumi Registry|
`pulumi-registry-list-resources`|List all resource types for a given provider and module|

---
## Tools Details

#### Tool: **`pulumi-cli-preview`**
Run pulumi preview for a given project and stack
Parameters|Type|Description
-|-|-
`workDir`|`string`|The working directory of the program.
`stackName`|`string` *optional*|The associated stack name. Defaults to 'dev'.

---
#### Tool: **`pulumi-cli-stack-output`**
Get the output value(s) of a given stack
Parameters|Type|Description
-|-|-
`workDir`|`string`|The working directory of the program.
`outputName`|`string` *optional*|The specific stack output name to retrieve.
`stackName`|`string` *optional*|The associated stack name. Defaults to 'dev'.

---
#### Tool: **`pulumi-cli-up`**
Run pulumi up for a given project and stack
Parameters|Type|Description
-|-|-
`workDir`|`string`|The working directory of the program.
`stackName`|`string` *optional*|The associated stack name. Defaults to 'dev'.

---
#### Tool: **`pulumi-registry-get-resource`**
Get information about a specific resource from the Pulumi Registry
Parameters|Type|Description
-|-|-
`provider`|`string`|The cloud provider (e.g., 'aws', 'azure', 'gcp', 'random') or github.com/org/repo for Git-hosted components
`resource`|`string`|The resource type to query (e.g., 'Bucket', 'Function', 'Instance')
`module`|`string` *optional*|The module to query (e.g., 's3', 'ec2', 'lambda'). Optional for smaller providers, will be 'index by default.

---
#### Tool: **`pulumi-registry-list-resources`**
List all resource types for a given provider and module
Parameters|Type|Description
-|-|-
`provider`|`string`|The cloud provider (e.g., 'aws', 'azure', 'gcp', 'random') or github.com/org/repo for Git-hosted components
`module`|`string` *optional*|Optional module to filter by (e.g., 's3', 'ec2', 'lambda')

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "pulumi": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/pulumi"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

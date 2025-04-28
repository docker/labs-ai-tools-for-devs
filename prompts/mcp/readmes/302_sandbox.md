# 302 Sandbox MCP Server

302 Sandbox MCP.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/302_sandbox](https://hub.docker.com/repository/docker/mcp/302_sandbox)
**Author**|[302ai](https://github.com/302ai)
**Repository**|https://github.com/302ai/302_sandbox_mcp
**Dockerfile**|https://github.com/302ai/302_sandbox_mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/302_sandbox)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`createSandbox`|Create a Linux sandbox that can execute code, run commands, upload and download files, and has complete Linux functionality.|
`directRunCode`|Automatically creates a sandbox, executes code, and immediately destroys the sandbox after execution.|
`downloadSandboxFiles`|Export files from a sandbox directory or file path to downloadable urls.|
`killSandbox`|Destroy a sandbox by its ID.|
`listSandboxFiles`|List files and directories at specified paths within a sandbox.|
`listSandboxes`|Query the list of sandboxes associated with the current API key.|
`runCode`|Run code on a specific sandbox.|
`runCommand`|Run a command line command on a specific linux sandbox.|
`writeSandboxFiles`|Import files from public URLs or base64 data into a sandbox.|

---
## Tools Details

#### Tool: **`createSandbox`**
Create a Linux sandbox that can execute code, run commands, upload and download files, and has complete Linux functionality. After successful creation, a sandbox_id will be returned, and all subsequent operations will need to include this sandbox_id to specify the corresponding sandbox. After successful creation, the sandbox will automatically pause. When calling other sandbox operation interfaces later, it will automatically reconnect and pause again after execution to avoid generating extra costs.
Parameters|Type|Description
-|-|-
`max_alive_time`|`integer`|Maximum alive time of the sandbox (seconds), recommand 300.
`envs`|`object` *optional*|Environment variables to set (optional)
`metadata`|`object` *optional*|Sandbox metadata (optional)
`sandbox_name`|`string` *optional*|Custom sandbox name (optional)

---
#### Tool: **`directRunCode`**
Automatically creates a sandbox, executes code, and immediately destroys the sandbox after execution. Optionally exports sandbox files (compresses multiple files into a zip archive if there are multiple files in the specified path, or exports a single file directly). Recommended for use cases that don't require continuous sandbox operations.
Parameters|Type|Description
-|-|-
`code`|`string`|The source code to be executed in the sandbox
`language`|`string`|The programming language to execute the code. If not provided or if the value is not in the allowed options, it will be treated as Python code
`envs`|`object` *optional*|Environment variables to be set during code execution. Supports passing custom environment variables as key-value pairs
`is_download`|`boolean` *optional*|Flag to indicate whether to download generated files. Must be enabled if the code generates files that need to be retrieved
`timeout`|`number` *optional*|Maximum execution time in seconds for the sandbox. If code execution exceeds this time, it will be terminated and return a timeout error. Default is 5

---
#### Tool: **`downloadSandboxFiles`**
Export files from a sandbox directory or file path to downloadable urls. Supports batch export of multiple directories or files. When exporting directories, only common file formats are included (documents, images, audio, video, compressed files, web files, and programming language files).
Parameters|Type|Description
-|-|-
`path`|`string`|Path(s) to export from the sandbox.
`sandbox_id`|`string`|The ID of the sandbox to export files from

---
#### Tool: **`killSandbox`**
Destroy a sandbox by its ID.
Parameters|Type|Description
-|-|-
`sandbox_id`|`string`|The ID of the sandbox to destroy

---
#### Tool: **`listSandboxFiles`**
List files and directories at specified paths within a sandbox. Supports batch queries with multiple paths. This operation can be used before downloadSandboxFiles to check if the file exists.
Parameters|Type|Description
-|-|-
`path`|`string`|
`sandbox_id`|`string`|The ID of the sandbox to query files from

---
#### Tool: **`listSandboxes`**
Query the list of sandboxes associated with the current API key. If no parameters are passed, all current sandboxes will be returned.
Parameters|Type|Description
-|-|-
`sandbox_id`|`string` *optional*|Filter by sandbox ID (optional)
`sandbox_name`|`string` *optional*|Filter by sandbox name provided during creation (optional)

---
#### Tool: **`runCode`**
Run code on a specific sandbox. This returns text output only. For operations that generate files, you'll need to use separate file viewing and export endpoints. Default file saving path is /home/user.
Parameters|Type|Description
-|-|-
`code`|`string`|The code to run
`sandbox_id`|`string`|The ID of the sandbox to run the code on
`envs`|`object` *optional*|Environment variables to set when running the code
`language`|`string` *optional*|The programming language to use. If not specified or if the value is not in the allowed range, it will be treated as Python code.
`timeout`|`integer` *optional*|The timeout for code execution in seconds

---
#### Tool: **`runCommand`**
Run a command line command on a specific linux sandbox. This returns text output only. For operations that generate files, you'll need to use separate file viewing and download endpoints.
Parameters|Type|Description
-|-|-
`cmd`|`string`|The command line command to run
`sandbox_id`|`string`|The ID of the sandbox to run the command on
`envs`|`object` *optional*|Environment variables to set when running the command
`timeout`|`integer` *optional*|The timeout for command execution in seconds. When installing dependencies or performing similar operations, it is recommended to set it to above 120 seconds.

---
#### Tool: **`writeSandboxFiles`**
Import files from public URLs or base64 data into a sandbox. Supports batch import of multiple files. If the target file already exists, it will be overwritten. If the target directory doesn't exist, it will be automatically created. You must create a sandbox before calling this tool.
Parameters|Type|Description
-|-|-
`file_list`|`array`|List of files to import into the sandbox
`sandbox_id`|`string`|The ID of the sandbox to write files to.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "302_sandbox": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "302AI_API_KEY",
        "mcp/302_sandbox"
      ],
      "env": {
        "302AI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

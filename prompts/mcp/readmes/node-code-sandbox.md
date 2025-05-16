# Node.js Sandbox MCP Server

A Node.js–based Model Context Protocol server that spins up disposable Docker containers to execute arbitrary JavaScript.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/node-code-sandbox](https://hub.docker.com/repository/docker/mcp/node-code-sandbox)
**Author**|[alfonsograziano](https://github.com/alfonsograziano)
**Repository**|https://github.com/alfonsograziano/node-code-sandbox-mcp
**Dockerfile**|https://github.com/alfonsograziano/node-code-sandbox-mcp/blob/master/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/node-code-sandbox)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/node-code-sandbox --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_dependency_types`|Given an array of npm package names (and optional versions), fetch whether each package ships its own TypeScript definitions or has a corresponding @types/… package, and return the raw .d.ts text.|
`run_js`|Install npm dependencies and run JavaScript code inside a running sandbox container.|
`run_js_ephemeral`|Run a JavaScript snippet in a temporary disposable container with optional npm dependencies, then automatically clean up.|
`sandbox_exec`|Execute one or more shell commands inside a running sandbox container.|
`sandbox_initialize`|Start a new isolated Docker container running Node.js.|
`sandbox_stop`|Terminate and remove a running sandbox container.|

---
## Tools Details

#### Tool: **`get_dependency_types`**
Given an array of npm package names (and optional versions), 
  fetch whether each package ships its own TypeScript definitions 
  or has a corresponding @types/… package, and return the raw .d.ts text.

  Useful whenwhen you're about to run a Node.js script against an unfamiliar dependency 
  and want to inspect what APIs and types it exposes.
Parameters|Type|Description
-|-|-
`dependencies`|`array`|

---
#### Tool: **`run_js`**
Install npm dependencies and run JavaScript code inside a running sandbox container.
  After running, you must manually stop the sandbox to free resources.
  The code must be valid ESModules (import/export syntax). Best for complex workflows where you want to reuse the environment across multiple executions.
  When reading and writing from the Node.js processes, you always need to read from and write to the "./files" directory to ensure persistence on the mounted volume.
Parameters|Type|Description
-|-|-
`code`|`string`|JavaScript code to run inside the container.
`container_id`|`string`|Docker container identifier
`dependencies`|`array` *optional*|A list of npm dependencies to install before running the code. Each item must have a `name` (package) and `version` (range). If none, returns an empty array.
`listenOnPort`|`number` *optional*|If set, leaves the process running and exposes this port to the host.

---
#### Tool: **`run_js_ephemeral`**
Run a JavaScript snippet in a temporary disposable container with optional npm dependencies, then automatically clean up. 
  The code must be valid ESModules (import/export syntax). Ideal for simple one-shot executions without maintaining a sandbox or managing cleanup manually.
  When reading and writing from the Node.js processes, you always need to read from and write to the "./files" directory to ensure persistence on the mounted volume.
  This includes images (e.g., PNG, JPEG) and other files (e.g., text, JSON, binaries).

  Example:
  ```js
  import fs from "fs/promises";
  await fs.writeFile("./files/hello.txt", "Hello world!");
  console.log("Saved ./files/hello.txt");
  ```
Parameters|Type|Description
-|-|-
`code`|`string`|JavaScript code to run inside the ephemeral container.
`dependencies`|`array` *optional*|A list of npm dependencies to install before running the code. Each item must have a `name` (package) and `version` (range). If none, returns an empty array.
`image`|`string` *optional*|Docker image to use for ephemeral execution. e.g. - **node:lts-slim**: Node.js LTS version, slim variant. (Lightweight and fast for JavaScript execution tasks.)
- **mcr.microsoft.com/playwright:v1.52.0-noble**: Playwright image for browser automation. (Preconfigured for running Playwright scripts.)
- **alfonsograziano/node-chartjs-canvas:latest**: Chart.js image for chart generation and mermaid charts generation. ('Preconfigured for generating charts with chartjs-node-canvas and Mermaid. Minimal Mermaid example:
    import fs from "fs";
    import { run } from "@mermaid-js/mermaid-cli";
    fs.writeFileSync("./files/diagram.mmd", "graph LR; A-->B;", "utf8");
    await run("./files/diagram.mmd", "./files/diagram.svg");)

---
#### Tool: **`sandbox_exec`**
Execute one or more shell commands inside a running sandbox container. Requires a sandbox initialized beforehand.
Parameters|Type|Description
-|-|-
`commands`|`array`|
`container_id`|`string`|

---
#### Tool: **`sandbox_initialize`**
Start a new isolated Docker container running Node.js. Used to set up a sandbox session for multiple commands and scripts.
Parameters|Type|Description
-|-|-
`image`|`string` *optional*|
`port`|`number` *optional*|If set, maps this container port to the host

---
#### Tool: **`sandbox_stop`**
Terminate and remove a running sandbox container. Should be called after finishing work in a sandbox initialized with sandbox_initialize.
Parameters|Type|Description
-|-|-
`container_id`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "node-code-sandbox": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/node-code-sandbox"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

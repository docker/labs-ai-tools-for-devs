# Puppeteer (Reference) MCP Server

Browser automation and web scraping using Puppeteer.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/puppeteer](https://hub.docker.com/repository/docker/mcp/puppeteer)
**Author**|[modelcontextprotocol](https://github.com/modelcontextprotocol)
**Repository**|https://github.com/modelcontextprotocol/servers
**Dockerfile**|https://github.com/modelcontextprotocol/servers/blob/2025.4.6/src/puppeteer/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/puppeteer)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/puppeteer --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`puppeteer_click`|Click an element on the page|
`puppeteer_evaluate`|Execute JavaScript in the browser console|
`puppeteer_fill`|Fill out an input field|
`puppeteer_hover`|Hover an element on the page|
`puppeteer_navigate`|Navigate to a URL|
`puppeteer_screenshot`|Take a screenshot of the current page or a specific element|
`puppeteer_select`|Select an element on the page with Select tag|

---
## Tools Details

#### Tool: **`puppeteer_click`**
Click an element on the page
Parameters|Type|Description
-|-|-
`selector`|`string`|CSS selector for element to click

---
#### Tool: **`puppeteer_evaluate`**
Execute JavaScript in the browser console
Parameters|Type|Description
-|-|-
`script`|`string`|JavaScript code to execute

---
#### Tool: **`puppeteer_fill`**
Fill out an input field
Parameters|Type|Description
-|-|-
`selector`|`string`|CSS selector for input field
`value`|`string`|Value to fill

---
#### Tool: **`puppeteer_hover`**
Hover an element on the page
Parameters|Type|Description
-|-|-
`selector`|`string`|CSS selector for element to hover

---
#### Tool: **`puppeteer_navigate`**
Navigate to a URL
Parameters|Type|Description
-|-|-
`url`|`string`|URL to navigate to
`allowDangerous`|`boolean` *optional*|Allow dangerous LaunchOptions that reduce security. When false, dangerous args like --no-sandbox will throw errors. Default false.
`launchOptions`|`object` *optional*|PuppeteerJS LaunchOptions. Default null. If changed and not null, browser restarts. Example: { headless: true, args: ['--no-sandbox'] }

---
#### Tool: **`puppeteer_screenshot`**
Take a screenshot of the current page or a specific element
Parameters|Type|Description
-|-|-
`name`|`string`|Name for the screenshot
`height`|`number` *optional*|Height in pixels (default: 600)
`selector`|`string` *optional*|CSS selector for element to screenshot
`width`|`number` *optional*|Width in pixels (default: 800)

---
#### Tool: **`puppeteer_select`**
Select an element on the page with Select tag
Parameters|Type|Description
-|-|-
`selector`|`string`|CSS selector for element to select
`value`|`string`|Value to select

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DOCKER_CONTAINER",
        "mcp/puppeteer"
      ],
      "env": {
        "DOCKER_CONTAINER": "true"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

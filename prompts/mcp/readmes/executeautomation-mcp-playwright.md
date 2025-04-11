# executeautomation-mcp-playwright MCP Server

Playwright Model Context Protocol Server - Tool to automate Browsers and APIs in Claude Desktop, Cline, Cursor IDE and More 🔌

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [executeautomation](https://github.com/executeautomation) |
| **Repository** | https://github.com/executeautomation/mcp-playwright |
| **Dockerfile** | https://github.com/executeautomation/mcp-playwright/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`clear_codegen_session`**: Clear a code generation session without generating a test
 1. **`end_codegen_session`**: End a code generation session and generate the test file
 1. **`get_codegen_session`**: Get information about a code generation session
 1. **`playwright_assert_response`**: Wait for and validate a previously initiated HTTP response wait operation.
 1. **`playwright_click`**: Click an element on the page
 1. **`playwright_close`**: Close the browser and release all resources
 1. **`playwright_console_logs`**: Retrieve console logs from the browser with filtering options
 1. **`playwright_custom_user_agent`**: Set a custom User Agent for the browser
 1. **`playwright_delete`**: Perform an HTTP DELETE request
 1. **`playwright_drag`**: Drag an element to a target location
 1. **`playwright_evaluate`**: Execute JavaScript in the browser console
 1. **`playwright_expect_response`**: Ask Playwright to start waiting for a HTTP response. This tool initiates the wait operation but does not wait for its completion.
 1. **`playwright_fill`**: fill out an input field
 1. **`playwright_get`**: Perform an HTTP GET request
 1. **`playwright_get_visible_html`**: Get the HTML content of the current page
 1. **`playwright_get_visible_text`**: Get the visible text content of the current page
 1. **`playwright_go_back`**: Navigate back in browser history
 1. **`playwright_go_forward`**: Navigate forward in browser history
 1. **`playwright_hover`**: Hover an element on the page
 1. **`playwright_iframe_click`**: Click an element in an iframe on the page
 1. **`playwright_navigate`**: Navigate to a URL
 1. **`playwright_patch`**: Perform an HTTP PATCH request
 1. **`playwright_post`**: Perform an HTTP POST request
 1. **`playwright_press_key`**: Press a keyboard key
 1. **`playwright_put`**: Perform an HTTP PUT request
 1. **`playwright_save_as_pdf`**: Save the current page as a PDF file
 1. **`playwright_screenshot`**: Take a screenshot of the current page or a specific element
 1. **`playwright_select`**: Select an element on the page with Select tag
 1. **`start_codegen_session`**: Start a new code generation session to record Playwright actions

## Tools

### Tool: **`clear_codegen_session`**

Clear a code generation session without generating a test

| Parameter | Type | Description |
| - | - | - |
| `sessionId` | `string` | ID of the session to clear |

### Tool: **`end_codegen_session`**

End a code generation session and generate the test file

| Parameter | Type | Description |
| - | - | - |
| `sessionId` | `string` | ID of the session to end |

### Tool: **`get_codegen_session`**

Get information about a code generation session

| Parameter | Type | Description |
| - | - | - |
| `sessionId` | `string` | ID of the session to retrieve |

### Tool: **`playwright_assert_response`**

Wait for and validate a previously initiated HTTP response wait operation.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Identifier of the HTTP response initially expected using `Playwright_expect_response`. |
| `value` | `string` *optional* | Data to expect in the body of the HTTP response. If provided, the assertion will fail if this value is not found in the response body. |

### Tool: **`playwright_click`**

Click an element on the page

| Parameter | Type | Description |
| - | - | - |
| `selector` | `string` | CSS selector for the element to click |

### Tool: **`playwright_close`**

Close the browser and release all resources

### Tool: **`playwright_console_logs`**

Retrieve console logs from the browser with filtering options

| Parameter | Type | Description |
| - | - | - |
| `clear` | `boolean` *optional* | Whether to clear logs after retrieval (default: false) |
| `limit` | `number` *optional* | Maximum number of logs to return |
| `search` | `string` *optional* | Text to search for in logs (handles text with square brackets) |
| `type` | `string` *optional* | Type of logs to retrieve (all, error, warning, log, info, debug) |

### Tool: **`playwright_custom_user_agent`**

Set a custom User Agent for the browser

| Parameter | Type | Description |
| - | - | - |
| `userAgent` | `string` | Custom User Agent for the Playwright browser instance |

### Tool: **`playwright_delete`**

Perform an HTTP DELETE request

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to perform DELETE operation |

### Tool: **`playwright_drag`**

Drag an element to a target location

| Parameter | Type | Description |
| - | - | - |
| `sourceSelector` | `string` | CSS selector for the element to drag |
| `targetSelector` | `string` | CSS selector for the target location |

### Tool: **`playwright_evaluate`**

Execute JavaScript in the browser console

| Parameter | Type | Description |
| - | - | - |
| `script` | `string` | JavaScript code to execute |

### Tool: **`playwright_expect_response`**

Ask Playwright to start waiting for a HTTP response. This tool initiates the wait operation but does not wait for its completion.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | Unique & arbitrary identifier to be used for retrieving this response later with `Playwright_assert_response`. |
| `url` | `string` | URL pattern to match in the response. |

### Tool: **`playwright_fill`**

fill out an input field

| Parameter | Type | Description |
| - | - | - |
| `selector` | `string` | CSS selector for input field |
| `value` | `string` | Value to fill |

### Tool: **`playwright_get`**

Perform an HTTP GET request

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to perform GET operation |

### Tool: **`playwright_get_visible_html`**

Get the HTML content of the current page

### Tool: **`playwright_get_visible_text`**

Get the visible text content of the current page

### Tool: **`playwright_go_back`**

Navigate back in browser history

### Tool: **`playwright_go_forward`**

Navigate forward in browser history

### Tool: **`playwright_hover`**

Hover an element on the page

| Parameter | Type | Description |
| - | - | - |
| `selector` | `string` | CSS selector for element to hover |

### Tool: **`playwright_iframe_click`**

Click an element in an iframe on the page

| Parameter | Type | Description |
| - | - | - |
| `iframeSelector` | `string` | CSS selector for the iframe containing the element to click |
| `selector` | `string` | CSS selector for the element to click |

### Tool: **`playwright_navigate`**

Navigate to a URL

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to navigate to the website specified |
| `browserType` | `string` *optional* | Browser type to use (chromium, firefox, webkit). Defaults to chromium |
| `headless` | `boolean` *optional* | Run browser in headless mode (default: false) |
| `height` | `number` *optional* | Viewport height in pixels (default: 720) |
| `timeout` | `number` *optional* | Navigation timeout in milliseconds |
| `waitUntil` | `string` *optional* | Navigation wait condition |
| `width` | `number` *optional* | Viewport width in pixels (default: 1280) |

### Tool: **`playwright_patch`**

Perform an HTTP PATCH request

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to perform PUT operation |
| `value` | `string` | Data to PATCH in the body |

### Tool: **`playwright_post`**

Perform an HTTP POST request

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to perform POST operation |
| `value` | `string` | Data to post in the body |
| `headers` | `object` *optional* | Additional headers to include in the request |
| `token` | `string` *optional* | Bearer token for authorization |

### Tool: **`playwright_press_key`**

Press a keyboard key

| Parameter | Type | Description |
| - | - | - |
| `key` | `string` | Key to press (e.g. 'Enter', 'ArrowDown', 'a') |
| `selector` | `string` *optional* | Optional CSS selector to focus before pressing key |

### Tool: **`playwright_put`**

Perform an HTTP PUT request

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL to perform PUT operation |
| `value` | `string` | Data to PUT in the body |

### Tool: **`playwright_save_as_pdf`**

Save the current page as a PDF file

| Parameter | Type | Description |
| - | - | - |
| `outputPath` | `string` | Directory path where PDF will be saved |
| `filename` | `string` *optional* | Name of the PDF file (default: page.pdf) |
| `format` | `string` *optional* | Page format (e.g. 'A4', 'Letter') |
| `margin` | `object` *optional* | Page margins |
| `printBackground` | `boolean` *optional* | Whether to print background graphics |

### Tool: **`playwright_screenshot`**

Take a screenshot of the current page or a specific element

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name for the screenshot |
| `downloadsDir` | `string` *optional* | Custom downloads directory path (default: user's Downloads folder) |
| `fullPage` | `boolean` *optional* | Store screenshot of the entire page (default: false) |
| `height` | `number` *optional* | Height in pixels (default: 600) |
| `savePng` | `boolean` *optional* | Save screenshot as PNG file (default: false) |
| `selector` | `string` *optional* | CSS selector for element to screenshot |
| `storeBase64` | `boolean` *optional* | Store screenshot in base64 format (default: true) |
| `width` | `number` *optional* | Width in pixels (default: 800) |

### Tool: **`playwright_select`**

Select an element on the page with Select tag

| Parameter | Type | Description |
| - | - | - |
| `selector` | `string` | CSS selector for element to select |
| `value` | `string` | Value to select |

### Tool: **`start_codegen_session`**

Start a new code generation session to record Playwright actions

| Parameter | Type | Description |
| - | - | - |
| `options` | `object` | Code generation options |

## Use this MCP Server

```json
{
  "mcpServers": {
    "executeautomation-mcp-playwright": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/executeautomation-mcp-playwright"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/executeautomation-mcp-playwright -f Dockerfile https://github.com/executeautomation/mcp-playwright.git
```


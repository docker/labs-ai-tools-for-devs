# Playwright MCP Server

Playwright MCP server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/playwright](https://hub.docker.com/repository/docker/mcp/playwright)
**Author**|[microsoft](https://github.com/microsoft)
**Repository**|https://github.com/microsoft/playwright-mcp
**Dockerfile**|https://github.com/microsoft/playwright-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/playwright)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/playwright --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`browser_click`|Perform click on a web page|
`browser_close`|Close the page|
`browser_console_messages`|Returns all console messages|
`browser_drag`|Perform drag and drop between two elements|
`browser_file_upload`|Upload one or multiple files|
`browser_generate_playwright_test`|Generate a Playwright test for given scenario|
`browser_handle_dialog`|Handle a dialog|
`browser_hover`|Hover over element on page|
`browser_install`|Install the browser specified in the config.|
`browser_navigate`|Navigate to a URL|
`browser_navigate_back`|Go back to the previous page|
`browser_navigate_forward`|Go forward to the next page|
`browser_network_requests`|Returns all network requests since loading the page|
`browser_pdf_save`|Save page as PDF|
`browser_press_key`|Press a key on the keyboard|
`browser_resize`|Resize the browser window|
`browser_select_option`|Select an option in a dropdown|
`browser_snapshot`|Capture accessibility snapshot of the current page, this is better than screenshot|
`browser_tab_close`|Close a tab|
`browser_tab_list`|List browser tabs|
`browser_tab_new`|Open a new tab|
`browser_tab_select`|Select a tab by index|
`browser_take_screenshot`|Take a screenshot of the current page.|
`browser_type`|Type text into editable element|
`browser_wait`|Wait for a specified time in seconds|

---
## Tools Details

#### Tool: **`browser_click`**
Perform click on a web page
Parameters|Type|Description
-|-|-
`element`|`string`|Human-readable element description used to obtain permission to interact with the element
`ref`|`string`|Exact target element reference from the page snapshot

---
#### Tool: **`browser_close`**
Close the page
#### Tool: **`browser_console_messages`**
Returns all console messages
#### Tool: **`browser_drag`**
Perform drag and drop between two elements
Parameters|Type|Description
-|-|-
`endElement`|`string`|Human-readable target element description used to obtain the permission to interact with the element
`endRef`|`string`|Exact target element reference from the page snapshot
`startElement`|`string`|Human-readable source element description used to obtain the permission to interact with the element
`startRef`|`string`|Exact source element reference from the page snapshot

---
#### Tool: **`browser_file_upload`**
Upload one or multiple files
Parameters|Type|Description
-|-|-
`paths`|`array`|The absolute paths to the files to upload. Can be a single file or multiple files.

---
#### Tool: **`browser_generate_playwright_test`**
Generate a Playwright test for given scenario
Parameters|Type|Description
-|-|-
`description`|`string`|The description of the test
`name`|`string`|The name of the test
`steps`|`array`|The steps of the test

---
#### Tool: **`browser_handle_dialog`**
Handle a dialog
Parameters|Type|Description
-|-|-
`accept`|`boolean`|Whether to accept the dialog.
`promptText`|`string` *optional*|The text of the prompt in case of a prompt dialog.

---
#### Tool: **`browser_hover`**
Hover over element on page
Parameters|Type|Description
-|-|-
`element`|`string`|Human-readable element description used to obtain permission to interact with the element
`ref`|`string`|Exact target element reference from the page snapshot

---
#### Tool: **`browser_install`**
Install the browser specified in the config. Call this if you get an error about the browser not being installed.
#### Tool: **`browser_navigate`**
Navigate to a URL
Parameters|Type|Description
-|-|-
`url`|`string`|The URL to navigate to

---
#### Tool: **`browser_navigate_back`**
Go back to the previous page
#### Tool: **`browser_navigate_forward`**
Go forward to the next page
#### Tool: **`browser_network_requests`**
Returns all network requests since loading the page
#### Tool: **`browser_pdf_save`**
Save page as PDF
#### Tool: **`browser_press_key`**
Press a key on the keyboard
Parameters|Type|Description
-|-|-
`key`|`string`|Name of the key to press or a character to generate, such as `ArrowLeft` or `a`

---
#### Tool: **`browser_resize`**
Resize the browser window
Parameters|Type|Description
-|-|-
`height`|`number`|Height of the browser window
`width`|`number`|Width of the browser window

---
#### Tool: **`browser_select_option`**
Select an option in a dropdown
Parameters|Type|Description
-|-|-
`element`|`string`|Human-readable element description used to obtain permission to interact with the element
`ref`|`string`|Exact target element reference from the page snapshot
`values`|`array`|Array of values to select in the dropdown. This can be a single value or multiple values.

---
#### Tool: **`browser_snapshot`**
Capture accessibility snapshot of the current page, this is better than screenshot
#### Tool: **`browser_tab_close`**
Close a tab
Parameters|Type|Description
-|-|-
`index`|`number` *optional*|The index of the tab to close. Closes current tab if not provided.

---
#### Tool: **`browser_tab_list`**
List browser tabs
#### Tool: **`browser_tab_new`**
Open a new tab
Parameters|Type|Description
-|-|-
`url`|`string` *optional*|The URL to navigate to in the new tab. If not provided, the new tab will be blank.

---
#### Tool: **`browser_tab_select`**
Select a tab by index
Parameters|Type|Description
-|-|-
`index`|`number`|The index of the tab to select

---
#### Tool: **`browser_take_screenshot`**
Take a screenshot of the current page. You can't perform actions based on the screenshot, use browser_snapshot for actions.
Parameters|Type|Description
-|-|-
`element`|`string` *optional*|Human-readable element description used to obtain permission to screenshot the element. If not provided, the screenshot will be taken of viewport. If element is provided, ref must be provided too.
`raw`|`boolean` *optional*|Whether to return without compression (in PNG format). Default is false, which returns a JPEG image.
`ref`|`string` *optional*|Exact target element reference from the page snapshot. If not provided, the screenshot will be taken of viewport. If ref is provided, element must be provided too.

---
#### Tool: **`browser_type`**
Type text into editable element
Parameters|Type|Description
-|-|-
`element`|`string`|Human-readable element description used to obtain permission to interact with the element
`ref`|`string`|Exact target element reference from the page snapshot
`text`|`string`|Text to type into the element
`slowly`|`boolean` *optional*|Whether to type one character at a time. Useful for triggering key handlers in the page. By default entire text is filled in at once.
`submit`|`boolean` *optional*|Whether to submit entered text (press Enter after)

---
#### Tool: **`browser_wait`**
Wait for a specified time in seconds
Parameters|Type|Description
-|-|-
`time`|`number`|The time to wait in seconds

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/playwright"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

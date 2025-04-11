# lmcc-dev-mult-fetch-mcp-server MCP Server

A versatile MCP-compliant web content fetching tool that supports multiple modes (browser/node), formats (HTML/JSON/Markdown/Text), and intelligent proxy detection, with bilingual interface (English/Chinese).

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [lmcc-dev](https://github.com/lmcc-dev) |
| **Repository** | https://github.com/lmcc-dev/mult-fetch-mcp-server |
| **Dockerfile** | https://github.com/lmcc-dev/mult-fetch-mcp-server/blob/refs/pull/8/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`fetch_html`**: Fetch a website and return the content as HTML. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.
 1. **`fetch_json`**: Fetch a JSON file from a URL. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large files. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.
 1. **`fetch_markdown`**: Fetch a website and return the content as Markdown. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.
 1. **`fetch_plaintext`**: Fetch a website and return the content as plain text with HTML tags removed. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.
 1. **`fetch_txt`**: Fetch a website, return the content as plain text (no HTML). Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

## Tools

### Tool: **`fetch_html`**

Fetch a website and return the content as HTML. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

| Parameter | Type | Description |
| - | - | - |
| `startCursor` | `number` | Starting cursor position in bytes. Set to 0 for initial requests, and use the value from previous responses for subsequent requests to resume content retrieval. |
| `url` | `string` | URL of the website to fetch |
| `autoDetectMode` | `boolean` *optional* | Optional flag to automatically switch to browser mode if standard fetch fails (default: true). Set to false to strictly use the specified mode without automatic switching. |
| `chunkId` | `string` *optional* | Optional chunk ID for retrieving a specific chunk of content from a previous request. The system adds prompts in the format === SYSTEM NOTE === ... =================== which AI models should ignore when processing the content. |
| `closeBrowser` | `boolean` *optional* | Optional flag to close the browser after fetching (default: false) |
| `contentSizeLimit` | `number` *optional* | Optional maximum content size in bytes before splitting into chunks (default: 50KB). Set between 20KB-50KB for optimal results. For large content, prefer smaller values (20KB-30KB) to avoid truncation. |
| `debug` | `boolean` *optional* | Optional flag to enable detailed debug logging (default: false) |
| `enableContentSplitting` | `boolean` *optional* | Optional flag to enable content splitting for large responses (default: true) |
| `extractContent` | `boolean` *optional* | Optional flag to enable intelligent content extraction using Readability algorithm (default: false). Extracts main article content from web pages. |
| `fallbackToOriginal` | `boolean` *optional* | Optional flag to fall back to the original content when extraction fails (default: true). Only works when extractContent is true. |
| `headers` | `object` *optional* | Optional headers to include in the request |
| `includeMetadata` | `boolean` *optional* | Optional flag to include metadata (title, author, etc.) in the extracted content (default: false). Only works when extractContent is true. |
| `maxRedirects` | `number` *optional* | Optional maximum number of redirects to follow (default: 10) |
| `noDelay` | `boolean` *optional* | Optional flag to disable random delay between requests (default: false) |
| `proxy` | `string` *optional* | Optional proxy server to use (format: http://host:port or https://host:port) |
| `saveCookies` | `boolean` *optional* | Optional flag to save cookies for future requests to the same domain (default: true) |
| `scrollToBottom` | `boolean` *optional* | Optional flag to scroll to bottom of page in browser mode (default: false) |
| `timeout` | `number` *optional* | Optional timeout in milliseconds (default: 30000) |
| `useBrowser` | `boolean` *optional* | Optional flag to use headless browser for fetching (default: false) |
| `useSystemProxy` | `boolean` *optional* | Optional flag to use system proxy environment variables (default: true) |
| `waitForSelector` | `string` *optional* | Optional CSS selector to wait for when using browser mode |
| `waitForTimeout` | `number` *optional* | Optional timeout to wait after page load in browser mode (default: 5000) |

### Tool: **`fetch_json`**

Fetch a JSON file from a URL. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large files. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

| Parameter | Type | Description |
| - | - | - |
| `startCursor` | `number` | Starting cursor position in bytes. Set to 0 for initial requests, and use the value from previous responses for subsequent requests to resume content retrieval. |
| `url` | `string` | URL of the website to fetch |
| `autoDetectMode` | `boolean` *optional* | Optional flag to automatically switch to browser mode if standard fetch fails (default: true). Set to false to strictly use the specified mode without automatic switching. |
| `chunkId` | `string` *optional* | Optional chunk ID for retrieving a specific chunk of content from a previous request. The system adds prompts in the format === SYSTEM NOTE === ... =================== which AI models should ignore when processing the content. |
| `closeBrowser` | `boolean` *optional* | Optional flag to close the browser after fetching (default: false) |
| `contentSizeLimit` | `number` *optional* | Optional maximum content size in bytes before splitting into chunks (default: 50KB). Set between 20KB-50KB for optimal results. For large content, prefer smaller values (20KB-30KB) to avoid truncation. |
| `debug` | `boolean` *optional* | Optional flag to enable detailed debug logging (default: false) |
| `enableContentSplitting` | `boolean` *optional* | Optional flag to enable content splitting for large responses (default: true) |
| `headers` | `object` *optional* | Optional headers to include in the request |
| `maxRedirects` | `number` *optional* | Optional maximum number of redirects to follow (default: 10) |
| `noDelay` | `boolean` *optional* | Optional flag to disable random delay between requests (default: false) |
| `proxy` | `string` *optional* | Optional proxy server to use (format: http://host:port or https://host:port) |
| `saveCookies` | `boolean` *optional* | Optional flag to save cookies for future requests to the same domain (default: true) |
| `scrollToBottom` | `boolean` *optional* | Optional flag to scroll to bottom of page in browser mode (default: false) |
| `timeout` | `number` *optional* | Optional timeout in milliseconds (default: 30000) |
| `useBrowser` | `boolean` *optional* | Optional flag to use headless browser for fetching (default: false) |
| `useSystemProxy` | `boolean` *optional* | Optional flag to use system proxy environment variables (default: true) |
| `waitForSelector` | `string` *optional* | Optional CSS selector to wait for when using browser mode |
| `waitForTimeout` | `number` *optional* | Optional timeout to wait after page load in browser mode (default: 5000) |

### Tool: **`fetch_markdown`**

Fetch a website and return the content as Markdown. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

| Parameter | Type | Description |
| - | - | - |
| `startCursor` | `number` | Starting cursor position in bytes. Set to 0 for initial requests, and use the value from previous responses for subsequent requests to resume content retrieval. |
| `url` | `string` | URL of the website to fetch |
| `autoDetectMode` | `boolean` *optional* | Optional flag to automatically switch to browser mode if standard fetch fails (default: true). Set to false to strictly use the specified mode without automatic switching. |
| `chunkId` | `string` *optional* | Optional chunk ID for retrieving a specific chunk of content from a previous request. The system adds prompts in the format === SYSTEM NOTE === ... =================== which AI models should ignore when processing the content. |
| `closeBrowser` | `boolean` *optional* | Optional flag to close the browser after fetching (default: false) |
| `contentSizeLimit` | `number` *optional* | Optional maximum content size in bytes before splitting into chunks (default: 50KB). Set between 20KB-50KB for optimal results. For large content, prefer smaller values (20KB-30KB) to avoid truncation. |
| `debug` | `boolean` *optional* | Optional flag to enable detailed debug logging (default: false) |
| `enableContentSplitting` | `boolean` *optional* | Optional flag to enable content splitting for large responses (default: true) |
| `extractContent` | `boolean` *optional* | Optional flag to enable intelligent content extraction using Readability algorithm (default: false). Extracts main article content from web pages. |
| `fallbackToOriginal` | `boolean` *optional* | Optional flag to fall back to the original content when extraction fails (default: true). Only works when extractContent is true. |
| `headers` | `object` *optional* | Optional headers to include in the request |
| `includeMetadata` | `boolean` *optional* | Optional flag to include metadata (title, author, etc.) in the extracted content (default: false). Only works when extractContent is true. |
| `maxRedirects` | `number` *optional* | Optional maximum number of redirects to follow (default: 10) |
| `noDelay` | `boolean` *optional* | Optional flag to disable random delay between requests (default: false) |
| `proxy` | `string` *optional* | Optional proxy server to use (format: http://host:port or https://host:port) |
| `saveCookies` | `boolean` *optional* | Optional flag to save cookies for future requests to the same domain (default: true) |
| `scrollToBottom` | `boolean` *optional* | Optional flag to scroll to bottom of page in browser mode (default: false) |
| `timeout` | `number` *optional* | Optional timeout in milliseconds (default: 30000) |
| `useBrowser` | `boolean` *optional* | Optional flag to use headless browser for fetching (default: false) |
| `useSystemProxy` | `boolean` *optional* | Optional flag to use system proxy environment variables (default: true) |
| `waitForSelector` | `string` *optional* | Optional CSS selector to wait for when using browser mode |
| `waitForTimeout` | `number` *optional* | Optional timeout to wait after page load in browser mode (default: 5000) |

### Tool: **`fetch_plaintext`**

Fetch a website and return the content as plain text with HTML tags removed. Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

| Parameter | Type | Description |
| - | - | - |
| `startCursor` | `number` | Starting cursor position in bytes. Set to 0 for initial requests, and use the value from previous responses for subsequent requests to resume content retrieval. |
| `url` | `string` | URL of the website to fetch |
| `autoDetectMode` | `boolean` *optional* | Optional flag to automatically switch to browser mode if standard fetch fails (default: true). Set to false to strictly use the specified mode without automatic switching. |
| `chunkId` | `string` *optional* | Optional chunk ID for retrieving a specific chunk of content from a previous request. The system adds prompts in the format === SYSTEM NOTE === ... =================== which AI models should ignore when processing the content. |
| `closeBrowser` | `boolean` *optional* | Optional flag to close the browser after fetching (default: false) |
| `contentSizeLimit` | `number` *optional* | Optional maximum content size in bytes before splitting into chunks (default: 50KB). Set between 20KB-50KB for optimal results. For large content, prefer smaller values (20KB-30KB) to avoid truncation. |
| `debug` | `boolean` *optional* | Optional flag to enable detailed debug logging (default: false) |
| `enableContentSplitting` | `boolean` *optional* | Optional flag to enable content splitting for large responses (default: true) |
| `extractContent` | `boolean` *optional* | Optional flag to enable intelligent content extraction using Readability algorithm (default: false). Extracts main article content from web pages. |
| `fallbackToOriginal` | `boolean` *optional* | Optional flag to fall back to the original content when extraction fails (default: true). Only works when extractContent is true. |
| `headers` | `object` *optional* | Optional headers to include in the request |
| `includeMetadata` | `boolean` *optional* | Optional flag to include metadata (title, author, etc.) in the extracted content (default: false). Only works when extractContent is true. |
| `maxRedirects` | `number` *optional* | Optional maximum number of redirects to follow (default: 10) |
| `noDelay` | `boolean` *optional* | Optional flag to disable random delay between requests (default: false) |
| `proxy` | `string` *optional* | Optional proxy server to use (format: http://host:port or https://host:port) |
| `saveCookies` | `boolean` *optional* | Optional flag to save cookies for future requests to the same domain (default: true) |
| `scrollToBottom` | `boolean` *optional* | Optional flag to scroll to bottom of page in browser mode (default: false) |
| `timeout` | `number` *optional* | Optional timeout in milliseconds (default: 30000) |
| `useBrowser` | `boolean` *optional* | Optional flag to use headless browser for fetching (default: false) |
| `useSystemProxy` | `boolean` *optional* | Optional flag to use system proxy environment variables (default: true) |
| `waitForSelector` | `string` *optional* | Optional CSS selector to wait for when using browser mode |
| `waitForTimeout` | `number` *optional* | Optional timeout to wait after page load in browser mode (default: 5000) |

### Tool: **`fetch_txt`**

Fetch a website, return the content as plain text (no HTML). Best practices: 1) Always set startCursor=0 for initial requests, and use the fetchedBytes value from previous response for subsequent requests to ensure content continuity. 2) Set contentSizeLimit between 20000-50000 for large pages. 3) When handling large content, use the chunking system by following the startCursor instructions in the system notes rather than increasing contentSizeLimit. 4) If content retrieval fails, you can retry using the same chunkId and startCursor, or adjust startCursor as needed but you must handle any resulting data duplication or gaps yourself. 5) Always explain to users when content is chunked and ask if they want to continue retrieving subsequent parts.

| Parameter | Type | Description |
| - | - | - |
| `startCursor` | `number` | Starting cursor position in bytes. Set to 0 for initial requests, and use the value from previous responses for subsequent requests to resume content retrieval. |
| `url` | `string` | URL of the website to fetch |
| `autoDetectMode` | `boolean` *optional* | Optional flag to automatically switch to browser mode if standard fetch fails (default: true). Set to false to strictly use the specified mode without automatic switching. |
| `chunkId` | `string` *optional* | Optional chunk ID for retrieving a specific chunk of content from a previous request. The system adds prompts in the format === SYSTEM NOTE === ... =================== which AI models should ignore when processing the content. |
| `closeBrowser` | `boolean` *optional* | Optional flag to close the browser after fetching (default: false) |
| `contentSizeLimit` | `number` *optional* | Optional maximum content size in bytes before splitting into chunks (default: 50KB). Set between 20KB-50KB for optimal results. For large content, prefer smaller values (20KB-30KB) to avoid truncation. |
| `debug` | `boolean` *optional* | Optional flag to enable detailed debug logging (default: false) |
| `enableContentSplitting` | `boolean` *optional* | Optional flag to enable content splitting for large responses (default: true) |
| `extractContent` | `boolean` *optional* | Optional flag to enable intelligent content extraction using Readability algorithm (default: false). Extracts main article content from web pages. |
| `fallbackToOriginal` | `boolean` *optional* | Optional flag to fall back to the original content when extraction fails (default: true). Only works when extractContent is true. |
| `headers` | `object` *optional* | Optional headers to include in the request |
| `includeMetadata` | `boolean` *optional* | Optional flag to include metadata (title, author, etc.) in the extracted content (default: false). Only works when extractContent is true. |
| `maxRedirects` | `number` *optional* | Optional maximum number of redirects to follow (default: 10) |
| `noDelay` | `boolean` *optional* | Optional flag to disable random delay between requests (default: false) |
| `proxy` | `string` *optional* | Optional proxy server to use (format: http://host:port or https://host:port) |
| `saveCookies` | `boolean` *optional* | Optional flag to save cookies for future requests to the same domain (default: true) |
| `scrollToBottom` | `boolean` *optional* | Optional flag to scroll to bottom of page in browser mode (default: false) |
| `timeout` | `number` *optional* | Optional timeout in milliseconds (default: 30000) |
| `useBrowser` | `boolean` *optional* | Optional flag to use headless browser for fetching (default: false) |
| `useSystemProxy` | `boolean` *optional* | Optional flag to use system proxy environment variables (default: true) |
| `waitForSelector` | `string` *optional* | Optional CSS selector to wait for when using browser mode |
| `waitForTimeout` | `number` *optional* | Optional timeout to wait after page load in browser mode (default: 5000) |

## Use this MCP Server

```json
{
  "mcpServers": {
    "lmcc-dev-mult-fetch-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/lmcc-dev-mult-fetch-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/lmcc-dev-mult-fetch-mcp-server -f Dockerfile https://github.com/lmcc-dev/mult-fetch-mcp-server.git#refs/pull/8/merge
```


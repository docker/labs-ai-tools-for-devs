# Firecrawl MCP Server

Official Firecrawl MCP Server - Adds powerful web scraping to Cursor, Claude and any other LLM clients.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/firecrawl](https://hub.docker.com/repository/docker/mcp/firecrawl)
**Author**|[mendableai](https://github.com/mendableai)
**Repository**|https://github.com/mendableai/firecrawl-mcp-server
**Dockerfile**|https://github.com/mendableai/firecrawl-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/firecrawl)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`firecrawl_check_crawl_status`|Check the status of a crawl job.|
`firecrawl_crawl`|Start an asynchronous crawl of multiple pages from a starting URL.|
`firecrawl_deep_research`|Conduct deep research on a query using web crawling, search, and AI analysis.|
`firecrawl_extract`|Extract structured information from web pages using LLM.|
`firecrawl_generate_llmstxt`|Generate standardized LLMs.txt file for a given URL, which provides context about how LLMs should interact with the website.|
`firecrawl_map`|Discover URLs from a starting point.|
`firecrawl_scrape`|Scrape a single webpage with advanced options for content extraction.|
`firecrawl_search`|Search and retrieve content from web pages with optional scraping.|

---
## Tools Details

#### Tool: **`firecrawl_check_crawl_status`**
Check the status of a crawl job.
Parameters|Type|Description
-|-|-
`id`|`string`|Crawl job ID to check

---
#### Tool: **`firecrawl_crawl`**
Start an asynchronous crawl of multiple pages from a starting URL. Supports depth control, path filtering, and webhook notifications.
Parameters|Type|Description
-|-|-
`url`|`string`|Starting URL for the crawl
`allowBackwardLinks`|`boolean` *optional*|Allow crawling links that point to parent directories
`allowExternalLinks`|`boolean` *optional*|Allow crawling links to external domains
`deduplicateSimilarURLs`|`boolean` *optional*|Remove similar URLs during crawl
`excludePaths`|`array` *optional*|URL paths to exclude from crawling
`ignoreQueryParameters`|`boolean` *optional*|Ignore query parameters when comparing URLs
`ignoreSitemap`|`boolean` *optional*|Skip sitemap.xml discovery
`includePaths`|`array` *optional*|Only crawl these URL paths
`limit`|`number` *optional*|Maximum number of pages to crawl
`maxDepth`|`number` *optional*|Maximum link depth to crawl
`scrapeOptions`|`object` *optional*|Options for scraping each page
`webhook`|`string` *optional*|

---
#### Tool: **`firecrawl_deep_research`**
Conduct deep research on a query using web crawling, search, and AI analysis.
Parameters|Type|Description
-|-|-
`query`|`string`|The query to research
`maxDepth`|`number` *optional*|Maximum depth of research iterations (1-10)
`maxUrls`|`number` *optional*|Maximum number of URLs to analyze (1-1000)
`timeLimit`|`number` *optional*|Time limit in seconds (30-300)

---
#### Tool: **`firecrawl_extract`**
Extract structured information from web pages using LLM. Supports both cloud AI and self-hosted LLM extraction.
Parameters|Type|Description
-|-|-
`urls`|`array`|List of URLs to extract information from
`allowExternalLinks`|`boolean` *optional*|Allow extraction from external links
`enableWebSearch`|`boolean` *optional*|Enable web search for additional context
`includeSubdomains`|`boolean` *optional*|Include subdomains in extraction
`prompt`|`string` *optional*|Prompt for the LLM extraction
`schema`|`object` *optional*|JSON schema for structured data extraction
`systemPrompt`|`string` *optional*|System prompt for LLM extraction

---
#### Tool: **`firecrawl_generate_llmstxt`**
Generate standardized LLMs.txt file for a given URL, which provides context about how LLMs should interact with the website.
Parameters|Type|Description
-|-|-
`url`|`string`|The URL to generate LLMs.txt from
`maxUrls`|`number` *optional*|Maximum number of URLs to process (1-100, default: 10)
`showFullText`|`boolean` *optional*|Whether to show the full LLMs-full.txt in the response

---
#### Tool: **`firecrawl_map`**
Discover URLs from a starting point. Can use both sitemap.xml and HTML link discovery.
Parameters|Type|Description
-|-|-
`url`|`string`|Starting URL for URL discovery
`ignoreSitemap`|`boolean` *optional*|Skip sitemap.xml discovery and only use HTML links
`includeSubdomains`|`boolean` *optional*|Include URLs from subdomains in results
`limit`|`number` *optional*|Maximum number of URLs to return
`search`|`string` *optional*|Optional search term to filter URLs
`sitemapOnly`|`boolean` *optional*|Only use sitemap.xml for discovery, ignore HTML links

---
#### Tool: **`firecrawl_scrape`**
Scrape a single webpage with advanced options for content extraction. Supports various formats including markdown, HTML, and screenshots. Can execute custom actions like clicking or scrolling before scraping.
Parameters|Type|Description
-|-|-
`url`|`string`|The URL to scrape
`actions`|`array` *optional*|List of actions to perform before scraping
`excludeTags`|`array` *optional*|HTML tags to exclude from extraction
`extract`|`object` *optional*|Configuration for structured data extraction
`formats`|`array` *optional*|Content formats to extract (default: ['markdown'])
`includeTags`|`array` *optional*|HTML tags to specifically include in extraction
`location`|`object` *optional*|Location settings for scraping
`mobile`|`boolean` *optional*|Use mobile viewport
`onlyMainContent`|`boolean` *optional*|Extract only the main content, filtering out navigation, footers, etc.
`removeBase64Images`|`boolean` *optional*|Remove base64 encoded images from output
`skipTlsVerification`|`boolean` *optional*|Skip TLS certificate verification
`timeout`|`number` *optional*|Maximum time in milliseconds to wait for the page to load
`waitFor`|`number` *optional*|Time in milliseconds to wait for dynamic content to load

---
#### Tool: **`firecrawl_search`**
Search and retrieve content from web pages with optional scraping. Returns SERP results by default (url, title, description) or full page content when scrapeOptions are provided.
Parameters|Type|Description
-|-|-
`query`|`string`|Search query string
`country`|`string` *optional*|Country code for search results (default: us)
`filter`|`string` *optional*|Search filter
`lang`|`string` *optional*|Language code for search results (default: en)
`limit`|`number` *optional*|Maximum number of results to return (default: 5)
`location`|`object` *optional*|Location settings for search
`scrapeOptions`|`object` *optional*|Options for scraping search results
`tbs`|`string` *optional*|Time-based search filter

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "FIRECRAWL_API_URL",
        "-e",
        "FIRECRAWL_RETRY_MAX_ATTEMPTS",
        "-e",
        "FIRECRAWL_RETRY_INITIAL_DELAY",
        "-e",
        "FIRECRAWL_RETRY_MAX_DELAY",
        "-e",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR",
        "-e",
        "FIRECRAWL_CREDIT_WARNING_THRESHOLD",
        "-e",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD",
        "-e",
        "FIRECRAWL_API_KEY",
        "mcp/firecrawl"
      ],
      "env": {
        "FIRECRAWL_API_URL": "https://api.firecrawl.dev/v1",
        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",
        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500",
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

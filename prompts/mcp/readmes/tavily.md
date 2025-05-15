# Tavily MCP Server

The Tavily MCP server provides seamless interaction with the tavily-search and tavily-extract tools, real-time web search capabilities through the tavily-search tool and Intelligent data extraction from web pages via the tavily-extract tool.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/tavily](https://hub.docker.com/repository/docker/mcp/tavily)
**Author**|[tavily-ai](https://github.com/tavily-ai)
**Repository**|https://github.com/tavily-ai/tavily-mcp
**Dockerfile**|https://github.com/tavily-ai/tavily-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/tavily)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/tavily --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`tavily-crawl`|A powerful web crawler that initiates a structured web crawl starting from a specified base URL.|
`tavily-extract`|A powerful web content extraction tool that retrieves and processes raw content from specified URLs, ideal for data collection, content analysis, and research tasks.|
`tavily-map`|A powerful web mapping tool that creates a structured map of website URLs, allowing you to discover and analyze site structure, content organization, and navigation paths.|
`tavily-search`|A powerful web search tool that provides comprehensive, real-time results using Tavily's AI search engine.|

---
## Tools Details

#### Tool: **`tavily-crawl`**
A powerful web crawler that initiates a structured web crawl starting from a specified base URL. The crawler expands from that point like a tree, following internal links across pages. You can control how deep and wide it goes, and guide it to focus on specific sections of the site.
Parameters|Type|Description
-|-|-
`url`|`string`|The root URL to begin the crawl
`allow_external`|`boolean` *optional*|Whether to allow following links that go to external domains
`categories`|`array` *optional*|Filter URLs using predefined categories like documentation, blog, api, etc
`extract_depth`|`string` *optional*|Advanced extraction retrieves more data, including tables and embedded content, with higher success but may increase latency
`limit`|`integer` *optional*|Total number of links the crawler will process before stopping
`max_breadth`|`integer` *optional*|Max number of links to follow per level of the tree (i.e., per page)
`max_depth`|`integer` *optional*|Max depth of the crawl. Defines how far from the base URL the crawler can explore.
`query`|`string` *optional*|Natural language instructions for the crawler
`select_domains`|`array` *optional*|Regex patterns to select crawling to specific domains or subdomains (e.g., ^docs\.example\.com$)
`select_paths`|`array` *optional*|Regex patterns to select only URLs with specific path patterns (e.g., /docs/.*, /api/v1.*)

---
#### Tool: **`tavily-extract`**
A powerful web content extraction tool that retrieves and processes raw content from specified URLs, ideal for data collection, content analysis, and research tasks.
Parameters|Type|Description
-|-|-
`urls`|`array`|List of URLs to extract content from
`extract_depth`|`string` *optional*|Depth of extraction - 'basic' or 'advanced', if usrls are linkedin use 'advanced' or if explicitly told to use advanced
`include_images`|`boolean` *optional*|Include a list of images extracted from the urls in the response

---
#### Tool: **`tavily-map`**
A powerful web mapping tool that creates a structured map of website URLs, allowing you to discover and analyze site structure, content organization, and navigation paths. Perfect for site audits, content discovery, and understanding website architecture.
Parameters|Type|Description
-|-|-
`url`|`string`|The root URL to begin the mapping
`allow_external`|`boolean` *optional*|Whether to allow following links that go to external domains
`categories`|`array` *optional*|Filter URLs using predefined categories like documentation, blog, api, etc
`limit`|`integer` *optional*|Total number of links the crawler will process before stopping
`max_breadth`|`integer` *optional*|Max number of links to follow per level of the tree (i.e., per page)
`max_depth`|`integer` *optional*|Max depth of the mapping. Defines how far from the base URL the crawler can explore
`query`|`string` *optional*|Natural language instructions for the crawler
`select_domains`|`array` *optional*|Regex patterns to select crawling to specific domains or subdomains (e.g., ^docs\.example\.com$)
`select_paths`|`array` *optional*|Regex patterns to select only URLs with specific path patterns (e.g., /docs/.*, /api/v1.*)

---
#### Tool: **`tavily-search`**
A powerful web search tool that provides comprehensive, real-time results using Tavily's AI search engine. Returns relevant web content with customizable parameters for result count, content type, and domain filtering. Ideal for gathering current information, news, and detailed web content analysis.
Parameters|Type|Description
-|-|-
`query`|`string`|Search query
`days`|`number` *optional*|The number of days back from the current date to include in the search results. This specifies the time frame of data to be retrieved. Please note that this feature is only available when using the 'news' search topic
`exclude_domains`|`array` *optional*|List of domains to specifically exclude, if the user asks to exclude a domain set this to the domain of the site
`include_domains`|`array` *optional*|A list of domains to specifically include in the search results, if the user asks to search on specific sites set this to the domain of the site
`include_image_descriptions`|`boolean` *optional*|Include a list of query-related images and their descriptions in the response
`include_images`|`boolean` *optional*|Include a list of query-related images in the response
`include_raw_content`|`boolean` *optional*|Include the cleaned and parsed HTML content of each search result
`max_results`|`number` *optional*|The maximum number of search results to return
`search_depth`|`string` *optional*|The depth of the search. It can be 'basic' or 'advanced'
`time_range`|`string` *optional*|The time range back from the current date to include in the search results. This feature is available for both 'general' and 'news' search topics
`topic`|`string` *optional*|The category of the search. This will determine which of our agents will be used for the search

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "tavily": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TAVILY_API_KEY",
        "mcp/tavily"
      ],
      "env": {
        "TAVILY_API_KEY": "your-tavily-apikey-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

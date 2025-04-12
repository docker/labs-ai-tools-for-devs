# oxylabs MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to seamlessly access web data through Oxylabs' powerful web scraping technology.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [oxylabs](https://github.com/oxylabs) |
| **Repository** | https://github.com/oxylabs/oxylabs-mcp |
| **Dockerfile** | https://github.com/oxylabs/oxylabs-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`oxylabs_amazon_product_scraper`**: Scrape Amazon Products using Oxylabs Web API
 1. **`oxylabs_amazon_search_scraper`**: Scrape Amazon Search results using Oxylabs Web API
 1. **`oxylabs_google_search_scraper`**: Scrape Google Search results using Oxylabs Web API
 1. **`oxylabs_universal_scraper`**: Scrape url using Oxylabs Web API with universal scraper
 1. **`oxylabs_web_unblocker`**: Scrape url using Oxylabs Web Unblocker

## Tools

### Tool: **`oxylabs_amazon_product_scraper`**

Scrape Amazon Products using Oxylabs Web API

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Keyword to search for. |
| `autoselect_variant` | `boolean` *optional* | To get accurate pricing/buybox data, set this parameter to true (which tells us to append the th=1&psc=1 URL parameters to the end of the product URL). |
| `currency` | `string` *optional* | Currency that will be used to display the prices. See: https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FzrXw45naRpCZ0Ku9AjY1%2Fuploads%2FIAHLazcDOwZSiZ6s8IJt%2FAmazon_search_currency_values.json?alt=media&token=b72b5c4d-3820-42a6-8e74-78ea6b44e93f |
| `domain` | `string` *optional* | Domain localization for Google. See: https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FiwDdoZGfMbUe5cRL2417%2Fuploads%2FS6e9iUtXb5YkRLlfQdm6%2Flocale.json?alt=media&token=435886ac-6223-42d4-8204-1e7d53512a42 |
| `geo_location` | `string` *optional* | The geographical location that the result should be adapted for. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/serp-localization#google |
| `locale` | `string` *optional* | 'Accept-Language' header value which changes your Google search page web interface language. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/domain-locale-results-language#locale-1 |
| `parse` | `boolean` *optional* | Should result be parsed. If result should not be parsed then html will be stripped and converted to markdown file. |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |
| `user_agent_type` | `string` *optional* | Device type and browser that will be used to determine User-Agent header value. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/user-agent-type |

### Tool: **`oxylabs_amazon_search_scraper`**

Scrape Amazon Search results using Oxylabs Web API

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Keyword to search for. |
| `category_id` | `string` *optional* | Search for items in a particular browse node (product category). |
| `currency` | `string` *optional* | Currency that will be used to display the prices. See: https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FzrXw45naRpCZ0Ku9AjY1%2Fuploads%2FIAHLazcDOwZSiZ6s8IJt%2FAmazon_search_currency_values.json?alt=media&token=b72b5c4d-3820-42a6-8e74-78ea6b44e93f |
| `domain` | `string` *optional* | Domain localization for Google. See: https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FiwDdoZGfMbUe5cRL2417%2Fuploads%2FS6e9iUtXb5YkRLlfQdm6%2Flocale.json?alt=media&token=435886ac-6223-42d4-8204-1e7d53512a42 |
| `geo_location` | `string` *optional* | The geographical location that the result should be adapted for. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/serp-localization#google |
| `locale` | `string` *optional* | 'Accept-Language' header value which changes your Google search page web interface language. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/domain-locale-results-language#locale-1 |
| `merchant_id` | `string` *optional* | Search for items sold by a particular seller. |
| `pages` | `integer` *optional* | Number of pages to retrieve. |
| `parse` | `boolean` *optional* | Should result be parsed. If result should not be parsed then html will be stripped and converted to markdown file. |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |
| `start_page` | `integer` *optional* | Starting page number. |
| `user_agent_type` | `string` *optional* | Device type and browser that will be used to determine User-Agent header value. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/user-agent-type |

### Tool: **`oxylabs_google_search_scraper`**

Scrape Google Search results using Oxylabs Web API

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | URL-encoded keyword to search for. |
| `ad_mode` | `boolean` *optional* | If true will use the Google Ads source optimized for the paid ads. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/google/ads |
| `domain` | `string` *optional* | Domain localization for Google. See: https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FiwDdoZGfMbUe5cRL2417%2Fuploads%2FS6e9iUtXb5YkRLlfQdm6%2Flocale.json?alt=media&token=435886ac-6223-42d4-8204-1e7d53512a42 |
| `geo_location` | `string` *optional* | The geographical location that the result should be adapted for. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/serp-localization#google |
| `limit` | `integer` *optional* | Number of results to retrieve in each page. |
| `locale` | `string` *optional* | 'Accept-Language' header value which changes your Google search page web interface language. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/domain-locale-results-language#locale-1 |
| `pages` | `integer` *optional* | Number of pages to retrieve. |
| `parse` | `boolean` *optional* | Should result be parsed. If result should not be parsed then html will be stripped and converted to markdown file. |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |
| `start_page` | `integer` *optional* | Starting page number. |
| `user_agent_type` | `string` *optional* | Device type and browser that will be used to determine User-Agent header value. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/user-agent-type |

### Tool: **`oxylabs_universal_scraper`**

Scrape url using Oxylabs Web API with universal scraper

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | Url to scrape with web scraper. |
| `parse` | `boolean` *optional* | Should result be parsed. If result should not be parsed then html will be stripped and converted to markdown file. |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |

### Tool: **`oxylabs_web_unblocker`**

Scrape url using Oxylabs Web Unblocker

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | Url to scrape with web scraper. |
| `render` | `string` *optional* | Whether a headless browser should be used to render the page. See: https://developers.oxylabs.io/scraper-apis/web-scraper-api/features/javascript-rendering `html` will return rendered html page `None` will not use render for scraping. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "oxylabs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "OXYLABS_USERNAME"
        "-e"
        "OXYLABS_PASSWORD"
        "mcp/oxylabs"
      ],
      "env": {
        "OXYLABS_USERNAME": "YOUR_USERNAME_HERE",
        "OXYLABS_PASSWORD": "YOUR_PASSWORD_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/oxylabs -f Dockerfile https://github.com/oxylabs/oxylabs-mcp.git
```


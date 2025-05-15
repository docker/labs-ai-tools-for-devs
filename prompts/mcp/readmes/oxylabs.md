# Oxylabs MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to seamlessly access web data through Oxylabs' powerful web scraping technology.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/oxylabs](https://hub.docker.com/repository/docker/mcp/oxylabs)
**Author**|[oxylabs](https://github.com/oxylabs)
**Repository**|https://github.com/oxylabs/oxylabs-mcp
**Dockerfile**|https://github.com/oxylabs/oxylabs-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/oxylabs)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/oxylabs --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`amazon_product_scraper`|Scrape Amazon products.|
`amazon_search_scraper`|Scrape Amazon search results.|
`google_search_scraper`|Scrape Google Search results.|
`universal_scraper`|Get a content of any webpage.|

---
## Tools Details

#### Tool: **`amazon_product_scraper`**
Scrape Amazon products.

    Supports content parsing, different user agent types, domain,
    geolocation, locale parameters and different output formats.
    Supports Amazon specific parameters such as currency and getting
    more accurate pricing data with auto select variant.
Parameters|Type|Description
-|-|-
`query`|`string`|Keyword to search for.
`autoselect_variant`|`boolean` *optional*|To get accurate pricing/buybox data, set this parameter to true.
`currency`|`string` *optional*|Currency that will be used to display the prices.
`domain`|`string` *optional*|
        Domain localization for Google.
        Use country top level domains.
        For example:
            - 'co.uk' for United Kingdom
            - 'us' for United States
            - 'fr' for France
        
`geo_location`|`string` *optional*|
        The geographical location that the result should be adapted for.
        Use ISO-3166 country codes.
        Examples:
            - 'California, United States'
            - 'Mexico'
            - 'US' for United States
            - 'DE' for Germany
            - 'FR' for France
        
`locale`|`string` *optional*|
        Set 'Accept-Language' header value which changes your Google search page web interface language.
        Examples:
            - 'en-US' for English, United States
            - 'de-AT' for German, Austria
            - 'fr-FR' for French, France
        
`output_format`|`string` *optional*|
        The format of the output. Works only when parse parameter is false.
            - links - Most efficient when the goal is navigation or finding specific URLs. Use this first when you need to locate a specific page within a website.
            - md - Best for extracting and reading visible content once you've found the right page. Use this to get structured content that's easy to read and process.
            - html - Should be used sparingly only when you need the raw HTML structure, JavaScript code, or styling information.
        
`parse`|`boolean` *optional*|Should result be parsed. If the result is not parsed, the output_format parameter is applied.
`render`|`string` *optional*|
        Whether a headless browser should be used to render the page.
        For example:
            - 'html' when browser is required to render the page.
        
`user_agent_type`|`string` *optional*|Device type and browser that will be used to determine User-Agent header value.

---
#### Tool: **`amazon_search_scraper`**
Scrape Amazon search results.

    Supports content parsing, different user agent types, pagination,
    domain, geolocation, locale parameters and different output formats.
    Supports Amazon specific parameters such as category id, merchant id, currency.
Parameters|Type|Description
-|-|-
`query`|`string`|Keyword to search for.
`category_id`|`string` *optional*|Search for items in a particular browse node (product category).
`currency`|`string` *optional*|Currency that will be used to display the prices.
`domain`|`string` *optional*|
        Domain localization for Google.
        Use country top level domains.
        For example:
            - 'co.uk' for United Kingdom
            - 'us' for United States
            - 'fr' for France
        
`geo_location`|`string` *optional*|
        The geographical location that the result should be adapted for.
        Use ISO-3166 country codes.
        Examples:
            - 'California, United States'
            - 'Mexico'
            - 'US' for United States
            - 'DE' for Germany
            - 'FR' for France
        
`locale`|`string` *optional*|
        Set 'Accept-Language' header value which changes your Google search page web interface language.
        Examples:
            - 'en-US' for English, United States
            - 'de-AT' for German, Austria
            - 'fr-FR' for French, France
        
`merchant_id`|`string` *optional*|Search for items sold by a particular seller.
`output_format`|`string` *optional*|
        The format of the output. Works only when parse parameter is false.
            - links - Most efficient when the goal is navigation or finding specific URLs. Use this first when you need to locate a specific page within a website.
            - md - Best for extracting and reading visible content once you've found the right page. Use this to get structured content that's easy to read and process.
            - html - Should be used sparingly only when you need the raw HTML structure, JavaScript code, or styling information.
        
`pages`|`integer` *optional*|Number of pages to retrieve.
`parse`|`boolean` *optional*|Should result be parsed. If the result is not parsed, the output_format parameter is applied.
`render`|`string` *optional*|
        Whether a headless browser should be used to render the page.
        For example:
            - 'html' when browser is required to render the page.
        
`start_page`|`integer` *optional*|Starting page number.
`user_agent_type`|`string` *optional*|Device type and browser that will be used to determine User-Agent header value.

---
#### Tool: **`google_search_scraper`**
Scrape Google Search results.

    Supports content parsing, different user agent types, pagination,
    domain, geolocation, locale parameters and different output formats.
Parameters|Type|Description
-|-|-
`query`|`string`|URL-encoded keyword to search for.
`ad_mode`|`boolean` *optional*|If true will use the Google Ads source optimized for the paid ads.
`domain`|`string` *optional*|
        Domain localization for Google.
        Use country top level domains.
        For example:
            - 'co.uk' for United Kingdom
            - 'us' for United States
            - 'fr' for France
        
`geo_location`|`string` *optional*|
        The geographical location that the result should be adapted for.
        Use ISO-3166 country codes.
        Examples:
            - 'California, United States'
            - 'Mexico'
            - 'US' for United States
            - 'DE' for Germany
            - 'FR' for France
        
`limit`|`integer` *optional*|Number of results to retrieve in each page.
`locale`|`string` *optional*|
        Set 'Accept-Language' header value which changes your Google search page web interface language.
        Examples:
            - 'en-US' for English, United States
            - 'de-AT' for German, Austria
            - 'fr-FR' for French, France
        
`output_format`|`string` *optional*|
        The format of the output. Works only when parse parameter is false.
            - links - Most efficient when the goal is navigation or finding specific URLs. Use this first when you need to locate a specific page within a website.
            - md - Best for extracting and reading visible content once you've found the right page. Use this to get structured content that's easy to read and process.
            - html - Should be used sparingly only when you need the raw HTML structure, JavaScript code, or styling information.
        
`pages`|`integer` *optional*|Number of pages to retrieve.
`parse`|`boolean` *optional*|Should result be parsed. If the result is not parsed, the output_format parameter is applied.
`render`|`string` *optional*|
        Whether a headless browser should be used to render the page.
        For example:
            - 'html' when browser is required to render the page.
        
`start_page`|`integer` *optional*|Starting page number.
`user_agent_type`|`string` *optional*|Device type and browser that will be used to determine User-Agent header value.

---
#### Tool: **`universal_scraper`**
Get a content of any webpage.

    Supports browser rendering, parsing of certain webpages
    and different output formats.
Parameters|Type|Description
-|-|-
`url`|`string`|Website url to scrape.
`geo_location`|`string` *optional*|
        The geographical location that the result should be adapted for.
        Use ISO-3166 country codes.
        Examples:
            - 'California, United States'
            - 'Mexico'
            - 'US' for United States
            - 'DE' for Germany
            - 'FR' for France
        
`output_format`|`string` *optional*|
        The format of the output. Works only when parse parameter is false.
            - links - Most efficient when the goal is navigation or finding specific URLs. Use this first when you need to locate a specific page within a website.
            - md - Best for extracting and reading visible content once you've found the right page. Use this to get structured content that's easy to read and process.
            - html - Should be used sparingly only when you need the raw HTML structure, JavaScript code, or styling information.
        
`render`|`string` *optional*|
        Whether a headless browser should be used to render the page.
        For example:
            - 'html' when browser is required to render the page.
        
`user_agent_type`|`string` *optional*|Device type and browser that will be used to determine User-Agent header value.

---
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
        "-e",
        "OXYLABS_USERNAME",
        "-e",
        "OXYLABS_PASSWORD",
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

# hyperbrowser MCP Server

A MCP server implementation for hyperbrowser

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [hyperbrowserai](https://github.com/hyperbrowserai) |
| **Repository** | https://github.com/hyperbrowserai/mcp |
| **Dockerfile** | https://github.com/hyperbrowserai/mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`browser_use_agent`**: This tool employs an open-source browser automation agent optimized specifically for fast, efficient, and cost-effective browser tasks using a cloud browser. It requires explicit, detailed instructions to perform highly specific interactions quickly.

Optimal for tasks requiring:
- Precise, explicitly defined interactions and actions
- Speed and efficiency with clear, unambiguous instructions
- Cost-effective automation at scale with straightforward workflows

Best suited use cases include:
- Explicitly defined registration and login processes
- Clearly guided navigation through web apps
- Structured, step-by-step web scraping with detailed guidance
- Extracting data via explicitly specified browser interactions

You must provide extremely detailed step-by-step instructions, including exact elements, actions, and explicit context. Clearly define the desired outcome for optimal results. Returns the completed result or an error message if issues arise.

Note: This agent trades off flexibility for significantly faster performance and lower costs compared to Claude and OpenAI agents.
 1. **`claude_computer_use_agent`**: This tool leverages Anthropic's Claude model to autonomously execute complex browser tasks with sophisticated reasoning capabilities using a cloud browser. It specializes in handling intricate, nuanced, or highly context-sensitive web interactions.

Optimal for tasks requiring:
- Complex reasoning over multiple web pages
- Nuanced interpretation and flexible decision-making
- Human-like interaction with detailed context awareness

Best suited use cases include:
- Multi-step processes requiring reasoning (e.g., detailed registrations or onboarding)
- Interacting intelligently with advanced web apps
- Conducting in-depth research with complex conditions
- Extracting information from dynamic or interactive websites

Provide detailed task instructions, relevant context, and clearly specify the desired outcome for best results. Returns the completed result or an error message if issues arise.
 1. **`crawl_webpages`**: Crawl a website starting from a URL and explore linked pages. This tool allows systematic collection of content from multiple pages within a domain. Use this for larger data collection tasks, content indexing, or site mapping.
 1. **`extract_structured_data`**: Extract structured data from a webpage. This tool allows you to extract structured data from a webpage using a schema.
 1. **`openai_computer_use_agent`**: This tool utilizes OpenAI's model to autonomously execute general-purpose browser-based tasks with balanced performance and reliability using a cloud browser. It handles complex interactions effectively with practical reasoning and clear execution.

Optimal for tasks requiring:
- Reliable, general-purpose browser automation
- Clear, structured interactions with moderate complexity
- Efficient handling of common web tasks and workflows

Best suited use cases include:
- Standard multi-step registration or form submissions
- Navigating typical web applications requiring multiple interactions
- Conducting structured web research tasks
- Extracting data through interactive web processes

Provide a clear step-by-step description, necessary context, and expected outcomes. Returns the completed result or an error message if issues arise.
 1. **`scrape_webpage`**: Scrape a webpage and extract its content in various formats. This tool allows fetching content from a single URL with configurable browser behavior options. Use this for extracting text content, HTML structure, collecting links, or capturing screenshots of webpages.
 1. **`search_with_bing`**: Search the web using Bing. This tool allows you to search the web using bing.com

## Tools

### Tool: **`browser_use_agent`**

This tool employs an open-source browser automation agent optimized specifically for fast, efficient, and cost-effective browser tasks using a cloud browser. It requires explicit, detailed instructions to perform highly specific interactions quickly.

Optimal for tasks requiring:
- Precise, explicitly defined interactions and actions
- Speed and efficiency with clear, unambiguous instructions
- Cost-effective automation at scale with straightforward workflows

Best suited use cases include:
- Explicitly defined registration and login processes
- Clearly guided navigation through web apps
- Structured, step-by-step web scraping with detailed guidance
- Extracting data via explicitly specified browser interactions

You must provide extremely detailed step-by-step instructions, including exact elements, actions, and explicit context. Clearly define the desired outcome for optimal results. Returns the completed result or an error message if issues arise.

Note: This agent trades off flexibility for significantly faster performance and lower costs compared to Claude and OpenAI agents.

| Parameter | Type | Description |
| - | - | - |
| `task` | `string` | The task to perform inside the browser |
| `maxSteps` | `integer` *optional* |  |
| `returnStepInfo` | `boolean` *optional* | Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false. |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`claude_computer_use_agent`**

This tool leverages Anthropic's Claude model to autonomously execute complex browser tasks with sophisticated reasoning capabilities using a cloud browser. It specializes in handling intricate, nuanced, or highly context-sensitive web interactions.

Optimal for tasks requiring:
- Complex reasoning over multiple web pages
- Nuanced interpretation and flexible decision-making
- Human-like interaction with detailed context awareness

Best suited use cases include:
- Multi-step processes requiring reasoning (e.g., detailed registrations or onboarding)
- Interacting intelligently with advanced web apps
- Conducting in-depth research with complex conditions
- Extracting information from dynamic or interactive websites

Provide detailed task instructions, relevant context, and clearly specify the desired outcome for best results. Returns the completed result or an error message if issues arise.

| Parameter | Type | Description |
| - | - | - |
| `task` | `string` | The task to perform inside the browser |
| `maxSteps` | `integer` *optional* |  |
| `returnStepInfo` | `boolean` *optional* | Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false. |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`crawl_webpages`**

Crawl a website starting from a URL and explore linked pages. This tool allows systematic collection of content from multiple pages within a domain. Use this for larger data collection tasks, content indexing, or site mapping.

| Parameter | Type | Description |
| - | - | - |
| `followLinks` | `boolean` | Whether to follow links on the crawled webpages |
| `outputFormat` | `array` | The format of the output |
| `url` | `string` | The URL of the webpage to crawl. |
| `ignoreSitemap` | `boolean` *optional* |  |
| `maxPages` | `integer` *optional* |  |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`extract_structured_data`**

Extract structured data from a webpage. This tool allows you to extract structured data from a webpage using a schema.

| Parameter | Type | Description |
| - | - | - |
| `prompt` | `string` | The prompt to use for the extraction |
| `urls` | `array` | The list of URLs of the webpages to extract structured information from. Can include wildcards (e.g. https://example.com/*) |
| `schema` | `string` *optional* | The json schema to use for the extraction. Must provide an object describing a spec compliant json schema, any other types are invalid. |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`openai_computer_use_agent`**

This tool utilizes OpenAI's model to autonomously execute general-purpose browser-based tasks with balanced performance and reliability using a cloud browser. It handles complex interactions effectively with practical reasoning and clear execution.

Optimal for tasks requiring:
- Reliable, general-purpose browser automation
- Clear, structured interactions with moderate complexity
- Efficient handling of common web tasks and workflows

Best suited use cases include:
- Standard multi-step registration or form submissions
- Navigating typical web applications requiring multiple interactions
- Conducting structured web research tasks
- Extracting data through interactive web processes

Provide a clear step-by-step description, necessary context, and expected outcomes. Returns the completed result or an error message if issues arise.

| Parameter | Type | Description |
| - | - | - |
| `task` | `string` | The task to perform inside the browser |
| `maxSteps` | `integer` *optional* |  |
| `returnStepInfo` | `boolean` *optional* | Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false. |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`scrape_webpage`**

Scrape a webpage and extract its content in various formats. This tool allows fetching content from a single URL with configurable browser behavior options. Use this for extracting text content, HTML structure, collecting links, or capturing screenshots of webpages.

| Parameter | Type | Description |
| - | - | - |
| `outputFormat` | `array` | The format of the output |
| `url` | `string` | The URL of the webpage to scrape |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

### Tool: **`search_with_bing`**

Search the web using Bing. This tool allows you to search the web using bing.com

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | The search query to submit to Bing |
| `numResults` | `integer` *optional* | Number of search results to return |
| `sessionOptions` | `object` *optional* | Options for the browser session. Avoid setting these if not mentioned explicitly |

## Use this MCP Server

```json
{
  "mcpServers": {
    "hyperbrowser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "HYPERBROWSER_API_KEY"
        "mcp/hyperbrowser"
      ],
      "env": {
        "HYPERBROWSER_API_KEY": "<app or user token>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/hyperbrowser -f Dockerfile https://github.com/hyperbrowserai/mcp.git
```


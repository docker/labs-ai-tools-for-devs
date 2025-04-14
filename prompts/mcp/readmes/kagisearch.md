# kagisearch MCP Server

A Model Context Protocol (MCP) server for Kagi search & other tools.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [kagisearch](https://github.com/kagisearch) |
| **Repository** | https://github.com/kagisearch/kagimcp |
| **Dockerfile** | https://github.com/kagisearch/kagimcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`kagi_search_fetch`**: Fetch web results based on one or more queries using the Kagi Search API. Use for general search and when the user explicitly tells you to 'fetch' results/information. Results are from all queries given. They are numbered continuously, so that a user may be able to refer to a result by a specific number.
 1. **`kagi_summarizer`**: Summarize content from a URL using the Kagi Summarizer API. The Summarizer can summarize any document type (text webpage, video, audio, etc.)

## Tools

### Tool: **`kagi_search_fetch`**

Fetch web results based on one or more queries using the Kagi Search API. Use for general search and when the user explicitly tells you to 'fetch' results/information. Results are from all queries given. They are numbered continuously, so that a user may be able to refer to a result by a specific number.

| Parameter | Type | Description |
| - | - | - |
| `queries` | `array` | One or more concise, keyword-focused search queries. Include essential context within each query for standalone use. |

### Tool: **`kagi_summarizer`**

Summarize content from a URL using the Kagi Summarizer API. The Summarizer can summarize any document type (text webpage, video, audio, etc.)

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | A URL to a document to summarize. |
| `summary_type` | `string` *optional* | Type of summary to produce. Options are 'summary' for paragraph prose and 'takeaway' for a bulleted list of key points. |
| `target_language` | `string` *optional* | Desired output language using language codes (e.g., 'EN' for English). If not specified, the document's original language influences the output. |

## Use this MCP Server

```json
{
  "mcpServers": {
    "kagisearch": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "KAGI_SUMMARIZER_ENGINE",
        "-e",
        "KAGI_API_KEY",
        "mcp/kagisearch"
      ],
      "env": {
        "KAGI_SUMMARIZER_ENGINE": "cecil",
        "KAGI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/kagisearch -f Dockerfile https://github.com/kagisearch/kagimcp.git
```


# enescinr-twitter-mcp MCP Server

A Model Context Protocol server allows to interact with Twitter, enabling posting tweets and searching Twitter.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [EnesCinr](https://github.com/EnesCinr) |
| **Repository** | https://github.com/EnesCinr/twitter-mcp |
| **Dockerfile** | https://github.com/EnesCinr/twitter-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`post_tweet`**: Post a new tweet to Twitter
 1. **`search_tweets`**: Search for tweets on Twitter

## Tools

### Tool: **`post_tweet`**

Post a new tweet to Twitter

| Parameter | Type | Description |
| - | - | - |
| `text` | `string` | The content of your tweet |

### Tool: **`search_tweets`**

Search for tweets on Twitter

| Parameter | Type | Description |
| - | - | - |
| `count` | `number` | Number of tweets to return (10-100) |
| `query` | `string` | Search query |

## Use this MCP Server

```json
{
  "mcpServers": {
    "enescinr-twitter-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/enescinr-twitter-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/enescinr-twitter-mcp -f Dockerfile https://github.com/EnesCinr/twitter-mcp.git
```


# laksh-star-mcp-server-tmdb MCP Server

MCP Server with TMDB

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [Laksh-star](https://github.com/Laksh-star) |
| **Repository** | https://github.com/Laksh-star/mcp-server-tmdb |
| **Dockerfile** | https://github.com/Laksh-star/mcp-server-tmdb/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`get_recommendations`**: Get movie recommendations based on a movie ID
 1. **`get_trending`**: Get trending movies for a time window
 1. **`search_movies`**: Search for movies by title or keywords

## Tools

### Tool: **`get_recommendations`**

Get movie recommendations based on a movie ID

| Parameter | Type | Description |
| - | - | - |
| `movieId` | `string` | TMDB movie ID to get recommendations for |

### Tool: **`get_trending`**

Get trending movies for a time window

| Parameter | Type | Description |
| - | - | - |
| `timeWindow` | `string` | Time window for trending movies |

### Tool: **`search_movies`**

Search for movies by title or keywords

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query for movie titles |

## Use this MCP Server

```json
{
  "mcpServers": {
    "laksh-star-mcp-server-tmdb": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "TMDB_API_KEY"
        "mcpcommunity/laksh-star-mcp-server-tmdb"
      ],
      "env": {
        "TMDB_API_KEY": "YOUR_TMDB_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/laksh-star-mcp-server-tmdb -f Dockerfile https://github.com/Laksh-star/mcp-server-tmdb.git
```


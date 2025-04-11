# icraft2170-youtube-data-mcp-server MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [icraft2170](https://github.com/icraft2170) |
| **Repository** | https://github.com/icraft2170/youtube-data-mcp-server |
| **Dockerfile** | https://github.com/icraft2170/youtube-data-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`compareVideos`**: Compares multiple videos based on their statistics. Returns a comparison of view counts, like counts, comment counts, and other metrics for the specified videos. Use this when you want to analyze the performance of multiple videos side by side.
 1. **`getChannelStatistics`**: Retrieves statistics for multiple channels. Returns detailed metrics including subscriber count, view count, and video count for each channel. Use this when you need to analyze the performance and reach of multiple YouTube channels.
 1. **`getChannelTopVideos`**: Retrieves the top videos from a specific channel. Returns a list of the most viewed or popular videos from the channel, based on view count. Use this when you want to identify the most successful content from a channel.
 1. **`getRelatedVideos`**: Retrieves related videos for a specific video. Returns a list of videos that are similar or related to the specified video, based on YouTube's recommendation algorithm. Use this when you want to discover content similar to a particular video.
 1. **`getTranscripts`**: Retrieves transcripts for multiple videos. Returns the text content of videos' captions, useful for accessibility and content analysis. Use this when you need the spoken content of multiple videos.
 1. **`getTrendingVideos`**: Retrieves trending videos based on region and category. Returns a list of videos that are currently popular in the specified region and category. Use this when you want to discover what's trending in specific areas or categories. Available category IDs: 1 (Film & Animation), 2 (Autos & Vehicles), 10 (Music), 15 (Pets & Animals), 17 (Sports), 18 (Short Movies), 19 (Travel & Events), 20 (Gaming), 21 (Videoblogging), 22 (People & Blogs), 23 (Comedy), 24 (Entertainment), 25 (News & Politics), 26 (Howto & Style), 27 (Education), 28 (Science & Technology), 29 (Nonprofits & Activism), 30 (Movies), 31 (Anime/Animation), 32 (Action/Adventure), 33 (Classics), 34 (Comedy), 35 (Documentary), 36 (Drama), 37 (Family), 38 (Foreign), 39 (Horror), 40 (Sci-Fi/Fantasy), 41 (Thriller), 42 (Shorts), 43 (Shows), 44 (Trailers).
 1. **`getVideoDetails`**: Get detailed information about multiple YouTube videos. Returns comprehensive data including video metadata, statistics, and content details. Use this when you need complete information about specific videos.
 1. **`getVideoEngagementRatio`**: Calculates the engagement ratio for multiple videos. Returns metrics such as view count, like count, comment count, and the calculated engagement ratio for each video. Use this when you want to measure the audience interaction with videos.
 1. **`searchVideos`**: Searches for videos based on a query string. Returns a list of videos matching the search criteria, including titles, descriptions, and metadata. Use this when you need to find videos related to specific topics or keywords.

## Tools

### Tool: **`compareVideos`**

Compares multiple videos based on their statistics. Returns a comparison of view counts, like counts, comment counts, and other metrics for the specified videos. Use this when you want to analyze the performance of multiple videos side by side.

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |

### Tool: **`getChannelStatistics`**

Retrieves statistics for multiple channels. Returns detailed metrics including subscriber count, view count, and video count for each channel. Use this when you need to analyze the performance and reach of multiple YouTube channels.

| Parameter | Type | Description |
| - | - | - |
| `channelIds` | `array` |  |

### Tool: **`getChannelTopVideos`**

Retrieves the top videos from a specific channel. Returns a list of the most viewed or popular videos from the channel, based on view count. Use this when you want to identify the most successful content from a channel.

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `maxResults` | `number` *optional* |  |

### Tool: **`getRelatedVideos`**

Retrieves related videos for a specific video. Returns a list of videos that are similar or related to the specified video, based on YouTube's recommendation algorithm. Use this when you want to discover content similar to a particular video.

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |
| `maxResults` | `number` *optional* |  |

### Tool: **`getTranscripts`**

Retrieves transcripts for multiple videos. Returns the text content of videos' captions, useful for accessibility and content analysis. Use this when you need the spoken content of multiple videos.

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |
| `lang` | `string` *optional* |  |

### Tool: **`getTrendingVideos`**

Retrieves trending videos based on region and category. Returns a list of videos that are currently popular in the specified region and category. Use this when you want to discover what's trending in specific areas or categories. Available category IDs: 1 (Film & Animation), 2 (Autos & Vehicles), 10 (Music), 15 (Pets & Animals), 17 (Sports), 18 (Short Movies), 19 (Travel & Events), 20 (Gaming), 21 (Videoblogging), 22 (People & Blogs), 23 (Comedy), 24 (Entertainment), 25 (News & Politics), 26 (Howto & Style), 27 (Education), 28 (Science & Technology), 29 (Nonprofits & Activism), 30 (Movies), 31 (Anime/Animation), 32 (Action/Adventure), 33 (Classics), 34 (Comedy), 35 (Documentary), 36 (Drama), 37 (Family), 38 (Foreign), 39 (Horror), 40 (Sci-Fi/Fantasy), 41 (Thriller), 42 (Shorts), 43 (Shows), 44 (Trailers).

| Parameter | Type | Description |
| - | - | - |
| `categoryId` | `string` *optional* |  |
| `maxResults` | `number` *optional* |  |
| `regionCode` | `string` *optional* |  |

### Tool: **`getVideoDetails`**

Get detailed information about multiple YouTube videos. Returns comprehensive data including video metadata, statistics, and content details. Use this when you need complete information about specific videos.

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |

### Tool: **`getVideoEngagementRatio`**

Calculates the engagement ratio for multiple videos. Returns metrics such as view count, like count, comment count, and the calculated engagement ratio for each video. Use this when you want to measure the audience interaction with videos.

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |

### Tool: **`searchVideos`**

Searches for videos based on a query string. Returns a list of videos matching the search criteria, including titles, descriptions, and metadata. Use this when you need to find videos related to specific topics or keywords.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` |  |
| `maxResults` | `number` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "icraft2170-youtube-data-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "YOUTUBE_API_KEY"
        "mcpcommunity/icraft2170-youtube-data-mcp-server"
      ],
      "env": {
        "YOUTUBE_API_KEY": "YOUR_YOUTUBE_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/icraft2170-youtube-data-mcp-server -f Dockerfile https://github.com/icraft2170/youtube-data-mcp-server.git
```


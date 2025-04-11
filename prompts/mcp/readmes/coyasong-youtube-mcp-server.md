# coyasong-youtube-mcp-server MCP Server

Youtube mcp server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [coyaSONG](https://github.com/coyaSONG) |
| **Repository** | https://github.com/coyaSONG/youtube-mcp-server |
| **Dockerfile** | https://github.com/coyaSONG/youtube-mcp-server/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`analyze-channel-videos`**: Analyze recent videos from a specific channel to identify performance trends
 1. **`compare-videos`**: Compare statistics for multiple YouTube videos
 1. **`enhanced-transcript`**: Advanced transcript extraction tool with filtering, search, and multi-video capabilities. Provides rich transcript data for detailed analysis and processing. This tool offers multiple advanced features: 1) Extract transcripts from multiple videos in one request; 2) Filter by time ranges to focus on specific parts; 3) Search for specific content within transcripts; 4) Segment transcripts for structural analysis; 5) Format output in different ways (raw, timestamped, merged text); 6) Include video metadata. Parameters: videoIds (required) - Array of YouTube video IDs (up to 5); language (optional) - Language code; format (optional) - Output format ("raw", "timestamped", "merged"); includeMetadata (optional) - Whether to include video details; filters (optional) - Complex filtering options including timeRange, search, and segment.
 1. **`get-channel-stats`**: Get statistical information for a specific YouTube channel (subscriber count, total views, video count, etc.)
 1. **`get-key-moments`**: Extract key moments with timestamps from a video transcript for easier navigation and summarization. This tool analyzes the video transcript to identify important segments based on content density and creates a structured output with timestamped key moments. Useful for quickly navigating to important parts of longer videos. Parameters: videoId (required) - The YouTube video ID; maxMoments (optional) - Number of key moments to extract (default: 5, max: 10). Returns a formatted text with key moments and their timestamps, plus the full transcript.
 1. **`get-segmented-transcript`**: Divide a video transcript into segments for easier analysis and navigation. This tool splits the video into equal time segments and extracts the transcript for each segment with proper timestamps. Ideal for analyzing the structure of longer videos or when you need to focus on specific parts of the content. Parameters: videoId (required) - The YouTube video ID; segmentCount (optional) - Number of segments to divide the video into (default: 4, max: 10). Returns a markdown-formatted text with each segment clearly labeled with time ranges and containing the relevant transcript text.
 1. **`get-trending-videos`**: Retrieve trending videos by region and category. This helps analyze current popular content trends.
 1. **`get-video-categories`**: Retrieve available video categories for a specific region
 1. **`get-video-comments`**: Retrieve comments for a specific YouTube video with sorting options
 1. **`get-video-stats`**: Get statistical information for a specific YouTube video (views, likes, comments, upload date, etc.)
 1. **`get-video-transcript`**: Get the transcript/captions for a YouTube video with optional language selection. This tool retrieves the full transcript of a video with timestamped captions. Each caption includes the text and its timestamp in the video. Parameters: videoId (required) - The YouTube video ID; language (optional) - Language code for the transcript (e.g., "en", "ko", "ja"). If not specified, the default language for the video will be used. Returns a text with each caption line preceded by its timestamp.
 1. **`search-videos`**: Search for YouTube videos with advanced filtering options. Supports parameters: - query: Search term (required) - maxResults: Number of results to return (1-50) - channelId: Filter by specific channel - order: Sort by date, rating, viewCount, relevance, title - type: Filter by resource type (video, channel, playlist) - videoDuration: Filter by length (short: <4min, medium: 4-20min, long: >20min) - publishedAfter/publishedBefore: Filter by publish date (ISO format) - videoCaption: Filter by caption availability - videoDefinition: Filter by quality (standard/high) - regionCode: Filter by country (ISO country code)

## Tools

### Tool: **`analyze-channel-videos`**

Analyze recent videos from a specific channel to identify performance trends

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |
| `maxResults` | `number` *optional* |  |
| `sortBy` | `string` *optional* |  |

### Tool: **`compare-videos`**

Compare statistics for multiple YouTube videos

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |

### Tool: **`enhanced-transcript`**

Advanced transcript extraction tool with filtering, search, and multi-video capabilities. Provides rich transcript data for detailed analysis and processing. This tool offers multiple advanced features: 1) Extract transcripts from multiple videos in one request; 2) Filter by time ranges to focus on specific parts; 3) Search for specific content within transcripts; 4) Segment transcripts for structural analysis; 5) Format output in different ways (raw, timestamped, merged text); 6) Include video metadata. Parameters: videoIds (required) - Array of YouTube video IDs (up to 5); language (optional) - Language code; format (optional) - Output format ("raw", "timestamped", "merged"); includeMetadata (optional) - Whether to include video details; filters (optional) - Complex filtering options including timeRange, search, and segment.

| Parameter | Type | Description |
| - | - | - |
| `videoIds` | `array` |  |
| `filters` | `object` *optional* |  |
| `format` | `string` *optional* |  |
| `includeMetadata` | `boolean` *optional* |  |
| `language` | `string` *optional* |  |

### Tool: **`get-channel-stats`**

Get statistical information for a specific YouTube channel (subscriber count, total views, video count, etc.)

| Parameter | Type | Description |
| - | - | - |
| `channelId` | `string` |  |

### Tool: **`get-key-moments`**

Extract key moments with timestamps from a video transcript for easier navigation and summarization. This tool analyzes the video transcript to identify important segments based on content density and creates a structured output with timestamped key moments. Useful for quickly navigating to important parts of longer videos. Parameters: videoId (required) - The YouTube video ID; maxMoments (optional) - Number of key moments to extract (default: 5, max: 10). Returns a formatted text with key moments and their timestamps, plus the full transcript.

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |
| `maxMoments` | `string` *optional* |  |

### Tool: **`get-segmented-transcript`**

Divide a video transcript into segments for easier analysis and navigation. This tool splits the video into equal time segments and extracts the transcript for each segment with proper timestamps. Ideal for analyzing the structure of longer videos or when you need to focus on specific parts of the content. Parameters: videoId (required) - The YouTube video ID; segmentCount (optional) - Number of segments to divide the video into (default: 4, max: 10). Returns a markdown-formatted text with each segment clearly labeled with time ranges and containing the relevant transcript text.

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |
| `segmentCount` | `string` *optional* |  |

### Tool: **`get-trending-videos`**

Retrieve trending videos by region and category. This helps analyze current popular content trends.

| Parameter | Type | Description |
| - | - | - |
| `categoryId` | `string` *optional* |  |
| `maxResults` | `number` *optional* |  |
| `regionCode` | `string` *optional* |  |

### Tool: **`get-video-categories`**

Retrieve available video categories for a specific region

| Parameter | Type | Description |
| - | - | - |
| `regionCode` | `string` *optional* |  |

### Tool: **`get-video-comments`**

Retrieve comments for a specific YouTube video with sorting options

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |
| `includeReplies` | `boolean` *optional* |  |
| `maxResults` | `number` *optional* |  |
| `order` | `string` *optional* |  |
| `pageToken` | `string` *optional* |  |

### Tool: **`get-video-stats`**

Get statistical information for a specific YouTube video (views, likes, comments, upload date, etc.)

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |

### Tool: **`get-video-transcript`**

Get the transcript/captions for a YouTube video with optional language selection. This tool retrieves the full transcript of a video with timestamped captions. Each caption includes the text and its timestamp in the video. Parameters: videoId (required) - The YouTube video ID; language (optional) - Language code for the transcript (e.g., "en", "ko", "ja"). If not specified, the default language for the video will be used. Returns a text with each caption line preceded by its timestamp.

| Parameter | Type | Description |
| - | - | - |
| `videoId` | `string` |  |
| `language` | `string` *optional* |  |

### Tool: **`search-videos`**

Search for YouTube videos with advanced filtering options. Supports parameters: - query: Search term (required) - maxResults: Number of results to return (1-50) - channelId: Filter by specific channel - order: Sort by date, rating, viewCount, relevance, title - type: Filter by resource type (video, channel, playlist) - videoDuration: Filter by length (short: <4min, medium: 4-20min, long: >20min) - publishedAfter/publishedBefore: Filter by publish date (ISO format) - videoCaption: Filter by caption availability - videoDefinition: Filter by quality (standard/high) - regionCode: Filter by country (ISO country code)

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` |  |
| `channelId` | `string` *optional* |  |
| `maxResults` | `number` *optional* |  |
| `order` | `string` *optional* |  |
| `publishedAfter` | `string` *optional* |  |
| `publishedBefore` | `string` *optional* |  |
| `regionCode` | `string` *optional* |  |
| `type` | `string` *optional* |  |
| `videoCaption` | `string` *optional* |  |
| `videoDefinition` | `string` *optional* |  |
| `videoDuration` | `string` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "coyasong-youtube-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "YOUTUBE_API_KEY"
        "mcpcommunity/coyasong-youtube-mcp-server"
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
docker build -t mcpcommunity/coyasong-youtube-mcp-server -f Dockerfile https://github.com/coyaSONG/youtube-mcp-server.git
```


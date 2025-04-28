# YouTube transcripts MCP Server

Retrieves transcripts for given YouTube video URLs.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/youtube-transcript](https://hub.docker.com/repository/docker/mcp/youtube-transcript)
**Author**|[jkawamoto](https://github.com/jkawamoto)
**Repository**|https://github.com/jkawamoto/mcp-youtube-transcript
**Dockerfile**|https://github.com/slimslenderslacks/mcp-youtube-transcript/blob/slim/docker/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/youtube-transcript)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`get_transcript`|Retrieves the transcript of a YouTube video.|

---
## Tools Details

#### Tool: **`get_transcript`**
Retrieves the transcript of a YouTube video.
Parameters|Type|Description
-|-|-
`url`|`string`|The URL of the YouTube video
`lang`|`string` *optional*|The preferred language for the transcript

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "youtube_transcript": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/youtube-transcript"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

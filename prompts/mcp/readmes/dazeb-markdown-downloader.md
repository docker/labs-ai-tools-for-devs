# dazeb-markdown-downloader MCP Server

A MCP Server that will download any webpage as markdown in an instant. Download docs straight to your IDE for AI context. Powered by Jina.ai

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [dazeb](https://github.com/dazeb) |
| **Repository** | https://github.com/dazeb/markdown-downloader |
| **Dockerfile** | https://github.com/dazeb/markdown-downloader/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create_subdirectory`**: Create a new subdirectory in the root download folder
 1. **`download_markdown`**: Download a webpage as markdown using r.jina.ai
 1. **`get_download_directory`**: Get the current download directory
 1. **`list_downloaded_files`**: List all downloaded markdown files
 1. **`set_download_directory`**: Set the main local download folder for markdown files

## Tools

### Tool: **`create_subdirectory`**

Create a new subdirectory in the root download folder

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the subdirectory to create |

### Tool: **`download_markdown`**

Download a webpage as markdown using r.jina.ai

| Parameter | Type | Description |
| - | - | - |
| `url` | `string` | URL of the webpage to download |
| `subdirectory` | `string` *optional* | Optional subdirectory to save the file in |

### Tool: **`get_download_directory`**

Get the current download directory

### Tool: **`list_downloaded_files`**

List all downloaded markdown files

| Parameter | Type | Description |
| - | - | - |
| `subdirectory` | `string` *optional* | Optional subdirectory to list files from |

### Tool: **`set_download_directory`**

Set the main local download folder for markdown files

| Parameter | Type | Description |
| - | - | - |
| `directory` | `string` | Full path to the download directory |

## Use this MCP Server

```json
{
  "mcpServers": {
    "dazeb-markdown-downloader": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/dazeb-markdown-downloader"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/dazeb-markdown-downloader -f Dockerfile https://github.com/dazeb/markdown-downloader.git
```


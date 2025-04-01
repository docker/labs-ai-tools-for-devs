---
mcp:
  - container:
      image: mcp/notion-server:latest
      workdir: /app
      secrets:
        notion.api_token: NOTION_API_TOKEN
    source:
      url: https://github.com/slimslenderslacks/mcp-notion-server/tree/main
---

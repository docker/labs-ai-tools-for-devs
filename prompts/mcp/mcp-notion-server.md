---
mcp:
  - container:
      image: mcp/notion-server:latest
      workdir: /app
      secrets:
        notion.api_token: NOTION_API_TOKEN
---

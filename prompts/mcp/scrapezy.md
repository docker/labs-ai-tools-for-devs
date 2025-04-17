---
mcp:
  - container:
      image: mcp/scrapezy:latest
      workdir: /app
      secrets:
        scrapezy.auth_token: SCRAPEZY_API_KEY
    source:
      url: https://github.com/Scrapezy/mcp/tree/main
---

---
mcp:
  - container:
      image: mcp/scrapegraph:latest
      workdir: /app
      secrets:
        scrapegraph.api_key: SGAI_API_KEY
    source:
      url: https://github.com/ScrapeGraphAI/scrapegraph-mcp/tree/main
---

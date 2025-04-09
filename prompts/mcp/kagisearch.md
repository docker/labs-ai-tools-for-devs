---
mcp:
  - container:
      image: mcp/kagisearch:latest
      secrets:
        kagi.api_key: KAGI_API_KEY
      environment:
        KAGI_SUMMARIZER_ENGINE: "{{kagi.engine}}"
  - source:
      url: https://github.com/kagisearch/kagimcp
---

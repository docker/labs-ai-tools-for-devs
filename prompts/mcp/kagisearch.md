---
mcp:
  - container:
      image: mcp/kagisearch:latest
      secrets:
        kagisearch.api_key: KAGI_API_KEY
      environment:
        KAGI_SUMMARIZER_ENGINE: "{{kagisearch.engine}}"
  - source:
      url: https://github.com/kagisearch/kagimcp/tree/main
---

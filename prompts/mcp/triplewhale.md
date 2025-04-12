---
mcp:
  - container:
      image: mcp/triplewhale:latest
      secrets:
        triplewhale.api_key: TRIPLEWHALE_API_KEY
  - source:
      url: https://github.com/Triple-Whale/mcp-server-triplewhale/tree/master
---

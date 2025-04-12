---
mcp:
  - container:
      image: mcp/e2b:latest
      secrets:
        e2b.api_key: E2B_API_KEY
  - source:
      url: https://github.com/e2b-dev/mcp-server/tree/main
---

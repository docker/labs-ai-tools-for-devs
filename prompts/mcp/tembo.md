---
mcp:
  - container:
      image: mcp/tembo:latest
      secrets:
        tembo.api_token: TEMBO_API_KEY
  - source:
      url: https://github.com/tembo-io/mcp-server-tembo/tree/main
---

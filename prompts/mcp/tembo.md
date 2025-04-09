---
mcp:
  - container:
      image: mcp/tembo
      secrets:
        tembo.api_token: TEMBO_API_KEY
  - source:
      url: https://github.com/tembo-io/mcp-server-tembo
---

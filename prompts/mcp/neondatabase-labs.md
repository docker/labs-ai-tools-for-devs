---
mcp:
  - container:
      image: mcp/neondatabase-labs:latest
      secrets:
        neondatabase-labs.api_key: NEON_API_KEY
  - source:
      url: https://github.com/neondatabase-labs/mcp-server-neon/tree/main
---

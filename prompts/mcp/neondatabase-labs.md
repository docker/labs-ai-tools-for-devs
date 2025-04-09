---
mcp:
  - container:
      image: mcp/neondatabase-labs
      secrets:
        neon.api_key: NEON_API_KEY
  - source:
      url: https://github.com/neondatabase-labs/mcp-server-neon
---

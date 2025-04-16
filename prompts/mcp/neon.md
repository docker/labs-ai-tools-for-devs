---
mcp:
  - container:
      image: mcp/neon:latest
      workdir: /app
      secrets:
        neon.api_key: NEON_API_KEY
    source:
      url: https://github.com/neondatabase/mcp-server-neon/tree/main
---

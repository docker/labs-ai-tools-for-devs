---
mcp:
  - container:
      image: mcp/neondatabase-labs:latest
      workdir: /app
      secrets:
        neondatabase-labs.api_key: NEON_API_KEY
    source:
      url: https://github.com/neondatabase-labs/mcp-server-neon/tree/main
---

---
mcp:
  - container:
      image: mcp/neon:latest
      workdir: /app
      secrets:
        neon.api_key: NEON_API_KEY
    source:
      url: https://github.com/neondatabase-labs/mcp-server-neon/tree/dbfa184afd9fc677c0d6b007a62b33194e883821
---

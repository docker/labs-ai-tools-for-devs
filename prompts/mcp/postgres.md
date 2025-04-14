---
mcp:
  - container:
      image: mcp/postgres:latest
      workdir: /app
      secrets:
        postgres.url: POSTGRES_URL
      command:
        - $POSTGRES_URL
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

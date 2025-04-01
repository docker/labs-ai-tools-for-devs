---
mcp:
  - container:
      image: mcp/postgresql:latest
      workdir: /app
    source:
      url: https://github.com/slimslenderslacks/postgresql-mcp-server/tree/main
---

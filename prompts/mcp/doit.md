---
mcp:
  - container:
      image: mcp/doit:latest
      workdir: /app
      secrets:
        doit.api_key: DOIT_API_KEY
    source:
      url: https://github.com/doitintl/doit-mcp-server/tree/main
---

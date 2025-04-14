---
mcp:
  - container:
      image: mcp/brave-search:latest
      workdir: /app
      secrets:
        brave.api_key: BRAVE_API_KEY
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

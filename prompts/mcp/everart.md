---
mcp:
  - container:
      image: mcp/everart:latest
      workdir: /app
      secrets:
        everart.api_key: EVERART_API_KEY
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

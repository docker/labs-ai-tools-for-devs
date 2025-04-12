---
mcp:
  - container:
      image: mcp/google-maps:latest
      workdir: /app
      secrets:
        google-maps.api_key: GOOGLE_MAPS_API_KEY
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

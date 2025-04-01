---
mcp:
  - container:
      image: mcp/google-maps:latest
      workdir: /app
      secrets:
        google.api_key: GOOGLE_MAPS_API_KEY
    source:
      url: https://github.com/docker/mcp-servers/tree/main
---


---
mcp:
  - container:
      image: mcp/gyazo:latest
      workdir: /app
      secrets:
        gyazo.access_token: GYAZO_ACCESS_TOKEN
    source:
      url: https://github.com/nota/gyazo-mcp-server/tree/main
---

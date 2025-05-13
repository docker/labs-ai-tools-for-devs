---
mcp:
  - container:
      image: mcp/husqvarna-automower:latest
      workdir: /app
      secrets:
        husqvarna.client.secret: HUSQVARNA_CLIENT_SECRET
      environment:
        HUSQVARNA_CLIENT_ID: "{{husqvarna-automower.client_id}}"
    source:
      url: https://github.com/jeanlaurent/mcp-husqvarna-automower/tree/main
---

---
mcp:
  - container:
      image: mcp/box:latest
      workdir: /app
      secrets:
        box.client_secret: BOX_CLIENT_SECRET
      environment:
        BOX_CLIENT_ID: "{{box.client_id}}"
    source:
      url: https://github.com/box-community/mcp-server-box/tree/refs/pull/4/merge
---

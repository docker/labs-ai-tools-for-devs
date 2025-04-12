---
mcp:
  - container:
      image: mcp/box:latest
      secrets:
        box.client_id: BOX_CLIENT_ID
        box.client_secret: BOX_CLIENT_SECRET
  - source:
      url: https://github.com/box-community/mcp-server-box/tree/refs/pull/4/merge
---

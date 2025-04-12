---
mcp:
  - container:
      image: mcp/lara:latest
      secrets:
        lara.key_id: LARA_ACCESS_KEY_ID
        lara.key_secret: LARA_ACCESS_KEY_SECRET
  - source:
      url: https://github.com/translated/lara-mcp/tree/main
---

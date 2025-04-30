---
mcp:
  - container:
      image: mcp/lara:latest
      workdir: /app
      secrets:
        lara.key_secret: LARA_ACCESS_KEY_SECRET
      environment:
        LARA_ACCESS_KEY_ID: "{{lara.key_id}}"
    source:
      url: https://github.com/translated/lara-mcp/tree/main
---

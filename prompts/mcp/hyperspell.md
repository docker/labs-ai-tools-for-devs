---
mcp:
  - container:
      image: mcp/hyperspell:latest
      secrets:
        hyperspell.token: HYPERSPELL_TOKEN
      environment:
        USE_RESOURCES: "{{hyperspell.use_resources}}"
        HYPERSPELL_COLLECTION: "{{hyperspell.collection}}"
  - source:
      url: https://github.com/hyperspell/hyperspell-mcp/tree/main
---

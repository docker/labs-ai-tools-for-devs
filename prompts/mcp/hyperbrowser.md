---
mcp:
  - container:
      image: mcp/hyperbrowser:latest
      secrets:
        hyperbrowser.api_key: HYPERBROWSER_API_KEY
      environment:
        USE_RESOURCES: "{{hyperbrowser.use_resources}}"
        HYPERSPELL_COLLECTION: "{{hyperbrowser.collection}}"
    source:
      url: https://github.com/hyperbrowserai/mcp/tree/main
---

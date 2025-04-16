---
mcp:
  - container:
      image: mcp/shopify:latest
      workdir: /app
    source:
      url: https://github.com/Shopify/dev-mcp/tree/refs/pull/7/merge
---

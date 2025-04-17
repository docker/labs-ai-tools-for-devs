---
mcp:
  - container:
      image: mcp/dappier:latest
      workdir: /app
      secrets:
        dappier.api_key: DAPPIER_API_KEY
    source:
      url: https://github.com/dappierai/dappier-mcp/tree/staging
---

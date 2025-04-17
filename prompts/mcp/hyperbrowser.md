---
mcp:
  - container:
      image: mcp/hyperbrowser:latest
      workdir: /usr/src/app
      secrets:
        hyperbrowser.api_key: HYPERBROWSER_API_KEY
    source:
      url: https://github.com/hyperbrowserai/mcp/tree/main
---

---
mcp:
  - container:
      image: mcp/hackle:latest
      workdir: /usr/src/app
      secrets:
        hackle.api_key: API_KEY
    source:
      url: https://github.com/hackle-io/hackle-mcp/tree/main
---

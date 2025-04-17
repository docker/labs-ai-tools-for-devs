---
mcp:
  - container:
      image: mcp/exa:latest
      workdir: /app
      secrets:
        exa.api_key: EXA_API_KEY
    source:
      url: https://github.com/exa-labs/exa-mcp-server/tree/main
---

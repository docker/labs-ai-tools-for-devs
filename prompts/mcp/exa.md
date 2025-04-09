---
mcp:
  - container:
      image: mcp/exa
      secrets:
        exa.api_key: EXA_API_KEY
  - source:
      url: https://github.com/exa-labs/exa-mcp-server
---

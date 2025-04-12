---
mcp:
  - container:
      image: mcp/wolfram-alpha:latest
      secrets:
        wolfram-alpha.api_key: WOLFRAM_API_KEY
    source:
      url: https://github.com/SecretiveShell/MCP-wolfram-alpha/tree/master
---

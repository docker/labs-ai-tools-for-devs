---
mcp:
  - container:
      image: mcp/chroma:latest
      secrets:
        chroma.api_key: CHROMA_API_KEY
  - source:
      url: https://github.com/chroma-core/chroma-mcp/tree/main
---

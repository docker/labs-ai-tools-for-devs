---
mcp:
  - container:
      image: mcp/bitrefill:latest
      secrets:
        bitrefill.api_secret: BITREFILL_API_SECRET
      environment:
        BITREFILL_API_ID: "{{bitrefill.api_id}}"
  - source:
      url: https://github.com/bitrefill/bitrefill-mcp-server/tree/master
---

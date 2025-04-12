---
mcp:
  - container:
      image: mcp/notion:latest
      secrets:
        notion.openai_mcp_headers: OPENAPI_MCP_HEADERS
  - source:
      url: https://github.com/makenotion/notion-mcp-server/tree/refs/pull/16/merge
---

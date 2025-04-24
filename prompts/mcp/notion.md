---
mcp:
  - container:
      image: mcp/notion:latest
      secrets:
        notion.internal_integration_token: INTERNAL_INTEGRATION_TOKEN
      environment:
        OPENAPI_MCP_HEADERS: "\"{\\\"Authorization\\\": \\\"Bearer $INTERNAL_INTEGRATION_TOKEN\\\", \\\"Notion-Version\\\": \\\"2022-06-28\\\"}\""
    source:
      url: https://github.com/makenotion/notion-mcp-server/tree/main
---

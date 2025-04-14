---
mcp:
  - container:
      image: mcp/notion:latest
      secrets:
        notion.integration_secret: INTEGRATION_SECRET
      environment:
        OPENAPI_MCP_HEADERS: "{\"Authorization\": \"Bearer $INTEGRATION_SECERET\", \"Notion-Version\": \"2022-06-28\"}"
    source:
      url: https://github.com/makenotion/notion-mcp-server/tree/main
---

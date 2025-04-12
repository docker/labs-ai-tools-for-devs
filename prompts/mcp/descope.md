---
mcp:
  - container:
      image: mcp/descope:latest
      secrets:
        descope.management_key: DESCOPE_MANAGEMENT_KEY
      environment:
        DESCOPE_PROJECT_ID: "{{descope.project_id}}"
  - source:
      url: https://github.com/descope-sample-apps/descope-mcp-server/tree/main
---

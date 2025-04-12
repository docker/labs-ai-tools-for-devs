---
mcp:
  - container:
      image: mcp/astra-db:latest
      secrets:
        astra-db.applicatin_token: ASTRA_DB_APPLICATION_TOKEN
      environment:
        ASTRA_DB_API_ENDPOINT: "{{astra-db.endpoint|safe}}"
  - source:
      url: https://github.com/datastax/astra-db-mcp/tree/refs/pull/14/merge
---

---
mcp:
  - container:
      image: mcp/mongodb:latest
      secrets:
        mongodb.connection_string: MDB_MCP_CONNECTION_STRING
    source:
      url: https://github.com/mongodb-js/mongodb-mcp-server/tree/main
---

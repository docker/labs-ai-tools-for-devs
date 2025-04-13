---
mcp:
  - container:
      image: mcp/postgres:latest
      workdir: /app
      command:
        - postgresql://host.docker.internal:5432/mydb
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

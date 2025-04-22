---
mcp:
  - container:
      image: mcp/azure:latest
      workdir: /app
      command:
        - "server"
        - "start"
    source:
      url: https://github.com/Azure/azure-mcp/tree/refs/pull/16/merge
---

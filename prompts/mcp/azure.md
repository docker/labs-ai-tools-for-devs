---
mcp:
  - container:
      image: mcp/azure:latest
      workdir: /app
      command:
        - "server"
        - "start"
    source:
      url: https://github.com/Azure/azure-mcp/tree/1ea702cb489ba95c5d9bea8d41fc18e9343703f8
---

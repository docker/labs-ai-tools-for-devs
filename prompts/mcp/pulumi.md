---
mcp:
  - container:
      image: mcp/pulumi:latest
      workdir: /app
    source:
      url: https://github.com/pulumi/mcp-server/tree/main
---

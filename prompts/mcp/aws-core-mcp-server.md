---
mcp:
  - container:
      image: mcp/aws-core-mcp-server:latest
      workdir: /var/task
    source:
      url: https://github.com/awslabs/mcp/tree/main/src/core-mcp-server
---

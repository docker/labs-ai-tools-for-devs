---
mcp:
  - container:
      image: mcp/aws-documentation:latest
      workdir: /var/task
    source:
      url: https://github.com/awslabs/mcp/tree/main/src/aws-documentation-mcp-server
---

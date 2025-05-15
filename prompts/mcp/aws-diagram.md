---
mcp:
  - container:
      image: mcp/aws-diagram:latest
      workdir: /var/task
    source:
      url: https://github.com/awslabs/mcp/tree/main/src/aws-diagram-mcp-server
---

---
mcp:
  - container:
      image: mcp/aws-cdk-mcp-server:latest
      workdir: /var/task
    source:
      url: https://github.com/awslabs/mcp/tree/main/src/cdk-mcp-server
---

---
mcp:
  - container:
      image: mcp/kubernetes:latest
      workdir: /usr/local/app
  - source:
      url: https://github.com/Flux159/mcp-server-kubernetes/tree/main
---

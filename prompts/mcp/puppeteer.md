---
mcp:
  - container:
      image: mcp/puppeteer:latest
      workdir: /project
      environment:
        DOCKER_CONTAINER: "true"
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

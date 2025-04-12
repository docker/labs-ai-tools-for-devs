---
mcp:
  - container:
      image: mcp/puppeteer:latest
      environment:
        DOCKER_CONTAINER: "true"
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

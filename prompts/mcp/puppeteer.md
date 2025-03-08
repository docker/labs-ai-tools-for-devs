---
mcp:
  - container:
      image: mcp/puppeteer:latest
      workdir: /app
      environment:
        - DOCKER_CONTAINER=true
---

---
mcp:
  - container:
      image: mcp/jetbrains:latest
      environment:
        IDE_PORT: "{{jetbrains.server.port}}"
        LOG_ENABLED: "true"   

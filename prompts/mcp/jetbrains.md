---
mcp:
  - container:
      image: mcp/jetbrains:latest
      environment:
        IDE_PORT: "{{jetbrains.server.port}}"
        LOG_ENABLED: "true"   
    source:
      url: https://github.com/GannaChernyshova/mcp-jetbrains/tree/main

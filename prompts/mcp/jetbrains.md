---
mcp:
  - container:
      image: mcp/jetbrains:latest
      environment:
        IDE_PORT: "{{jetbrains.port}}"
    source:
      url: https://github.com/GannaChernyshova/mcp-jetbrains/tree/main
---

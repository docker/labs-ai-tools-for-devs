---
mcp:
  - container:
      image: mcp/dart:latest
      workdir: /app
      secrets:
        dart.token: DART_TOKEN
      environment:
        DART_HOST: "{{dart.host|safe}}"
    source:
      url: https://github.com/its-dart/dart-mcp-server/tree/main
---

---
mcp:
  - container:
      image: mcp/dart:latest
      secrets:
        dart.token: DART_TOKEN
      environment:
        DART_HOST: "{{dart.host|safe}}"
  - source:
      url: https://github.com/its-dart/dart-mcp-server/tree/main
---

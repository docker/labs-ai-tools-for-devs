---
mcp:
  - container:
      image: mcp/glif:latest
      secrets:
        glif.api_token: GLIF_API_TOKEN
      environment:
        GLIF_IDS: "{{glif.ids}}"
        IGNORE_SAVED_GLIFS: "{{glif.ignored_saved}}"
  - source:
      url: https://github.com/glifxyz/glif-mcp-server/tree/main
---

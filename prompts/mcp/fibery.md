---
mcp:
  - container:
      image: mcp/fibery:latest
      workdir: /app
      secrets:
        fibery.api_token: FIBERY_API_TOKEN
      environment:
        FIBERY_HOST: "{{fibery.host|safe}}"
    source:
      url: https://github.com/Fibery-inc/fibery-mcp-server/tree/main
---

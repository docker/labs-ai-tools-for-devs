---
mcp:
  - container:
      image: mcp/iaptic:latest
      secrets:
        iaptic.api_key: IAPTIC_API_KEY
      environment:
        IAPTIC_APP_NAME: "{{iaptic.app_name}}"
  - source:
      url: https://github.com/iaptic/mcp-server-iaptic/tree/main
---

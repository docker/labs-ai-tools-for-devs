---
mcp:
  - container:
      image: mcp/oxylabs
      secrets:
        oxylabs.password: OXYLABS_PASSWORD
      environment:
        OXYLABS_USERNAME: "{{oxylabs.username}}"
  - source:
      url: https://github.com/oxylabs/oxylabs-mcp
---

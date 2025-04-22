---
mcp:
  - container:
      image: mcp/risken:latest
      secrets:
        risken.access_key: RISKEN_ACCESS_TOKEN
      environment:
        RISKEN_URL: "{{risken.url|safe}}"
      command:
        - "stdio"
    source:
      url: https://github.com/ca-risken/risken-mcp-server/tree/main
---

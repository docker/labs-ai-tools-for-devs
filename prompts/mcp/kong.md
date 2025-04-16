---
mcp:
  - container:
      image: mcp/kong:latest
      workdir: /app
      secrets:
        kong.access_token: KONNECT_ACCESS_TOKEN
      environment:
        KONNECT_REGION: "{{kong.region}}"
    source:
      url: https://github.com/Kong/mcp-konnect/tree/refs/pull/7/merge
---

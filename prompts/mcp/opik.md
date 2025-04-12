---
mcp:
  - container:
      image: mcp/opik:latest
      secrets:
        opik.api_key: OPIK_API_KEY
      environment:
        OPIK_API_BASE_URL: "{{opik.api_base_url|safe}}"
        OPIK_WORKSPACE_NAME: "{{opik.workspace_name}}"
  - source:
      url: https://github.com/comet-ml/opik-mcp/tree/main
---

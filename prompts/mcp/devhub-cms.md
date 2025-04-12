---
mcp:
  - container:
      image: mcp/devhub-cms:latest
      secrets:
        devhub-cms.api_key: DEVHUB_API_KEY
        devhub-cms.api_secret: DEVHUB_API_SECRET
      environment:
        DEVHUB_BASE_URL: "{{devhub-cms.url|safe}}"
  - source:
      url: https://github.com/devhub/devhub-cms-mcp/tree/main
---

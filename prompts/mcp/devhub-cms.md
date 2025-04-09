---
mcp:
  - container:
      image: mcp/devhub-cms:latest
      secrets:
        devhub.api_key: DEVHUB_API_KEY
        devhub.api_secret: DEVHUB_API_SECRET
      environment:
        DEVHUB_BASE_URL: "{{devhub.url|safe}}"
  - source:
      url: https://github.com/devhub/devhub-cms-mcp
---

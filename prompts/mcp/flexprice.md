---
mcp:
  - container:
      image: mcp/flexprice:latest
      workdir: /app
      secrets:
        flexprice.api_key: API_KEY
      environment:
        BASE_URL: "{{flexprice.base_url}}"
    source:
      url: https://github.com/flexprice/mcp-server/tree/main
---

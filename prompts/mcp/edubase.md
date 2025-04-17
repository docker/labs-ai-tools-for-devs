---
mcp:
  - container:
      image: mcp/edubase:latest
      workdir: /app
      secrets:
        edubase.api_key: EDUBASE_API_KEY
      environment:
        EDUBASE_API_APP: "{{edubase.app}}"
        EDUBASE_API_URL: "{{edubase.url|safe}}"
    source:
      url: https://github.com/EduBase/MCP/tree/main
---

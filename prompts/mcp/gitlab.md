---
mcp:
  - container:
      image: mcp/gitlab:latest
      workdir: /app
      secrets:
        gitlab.personal_access_token: GITLAB_PERSONAL_ACCESS_TOKEN
      environment:
        GITLAB_API_URL: "{{gitlab.url|safe}}"
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

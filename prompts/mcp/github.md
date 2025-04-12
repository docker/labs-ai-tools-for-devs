---
mcp:
  - container:
      image: mcp/github:latest
      workdir: /app
      secrets:
        github.personal_access_token: GITHUB_PERSONAL_ACCESS_TOKEN
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

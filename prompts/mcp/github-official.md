---
mcp:
  - container:
      image: mcp/github-mcp-server:latest
      workdir: /server
      secrets:
        github.personal_access_token: GITHUB_PERSONAL_ACCESS_TOKEN
    source:
      url: https://github.com/dgageot/github-mcp-server/tree/temp-fix
---

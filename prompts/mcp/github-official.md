---
mcp:
  - container:
      image: ghcr.io/github/github-mcp-server:latest
      secrets:
        github.personal_access_token: GITHUB_PERSONAL_ACCESS_TOKEN
  - source:
      url: https://github.com/github/github-mcp-server/tree/main
---

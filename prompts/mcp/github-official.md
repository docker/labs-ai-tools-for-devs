---
mcp:
  - container:
      image: mcp/github-mcp-server:latest
      secrets:
        github.personal_access_token: GITHUB_PERSONAL_ACCESS_TOKEN
    source:
      url: https://github.com/docker/labs-ai-tools-for-devs/tree/main/functions/github-mcp-server
---

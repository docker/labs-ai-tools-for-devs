---
mcp:
  - container:
      image: mcp/github-chat
      secrets:
        github-chat.api_key: GITHUB_API_KEY
  - source:
      url: https://github.com/AsyncFuncAI/github-chat-mcp
---

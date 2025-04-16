---
mcp:
  - container:
      image: mcp/tavily:latest
      workdir: /app
      secrets:
        tavily.api_token: TAVILY_API_KEY
    source:
      url: https://github.com/tavily-ai/tavily-mcp/tree/main
---

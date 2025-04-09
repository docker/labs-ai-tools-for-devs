---
mcp:
  - container:
      image: mcp/tavily
      secrets:
        tavily.api_token: TAVILY_API_KEY
  - source:
      url: https://github.com/tavily-ai/tavily-mcp
---

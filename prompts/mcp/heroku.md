---
mcp:
  - container:
      image: mcp/heroku:latest
      secrets:
        heroku.api_key: HEROKU_API_KEY
  - source:
      url: https://github.com/heroku/heroku-mcp-server
---

---
mcp:
  - container:
      image: mcp/tweetbinder:latest
      secrets:
        tweetbinder.api_token: TWEETBINDER_API_TOKEN
  - source:
      url: https://github.com/audienseco/mcp-tweetbinder/tree/main
---

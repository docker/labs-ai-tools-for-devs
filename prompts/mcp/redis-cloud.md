---
mcp:
  - container:
      image: mcp/redis-cloud:latest
      secrets:
        redis-cloud.api_key: API_KEY
        redis-cloud.secret_key: SECRET_KEY
  - source:
      url: https://github.com/redis/mcp-redis-cloud/tree/main
---

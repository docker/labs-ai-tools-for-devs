---
mcp:
  - container:
      image: mcp/redis-cloud:latest
      workdir: /app
      secrets:
        redis-cloud.secret_key: SECRET_KEY
      environment:
        API_KEY: "{{redis-cloud.api_key}}"
    source:
      url: https://github.com/redis/mcp-redis-cloud/tree/main
---

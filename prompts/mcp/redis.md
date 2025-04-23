---
mcp:
  - container:
      image: mcp/redis:latest
      workdir: /app
      secrets:
        redis.password: REDIS_PWD
      environment:
        REDIS_HOST: "{{redis.host}}"
        REDIS_PORT: "{{redis.port}}"
        REDIS_USERNAME: "{{redis.username}}"
        REDIS_SSL: "{{redis.ssl}}"
    source:
      url: https://github.com/redis/mcp-redis/tree/main
---

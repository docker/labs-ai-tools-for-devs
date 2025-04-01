---
mcp:
  - container:
      image: mcp/redis:latest
      workdir: /app
      secrets:
        redis.host: REDIS_HOST
        redis.port: REDIS_PORT
      command:
        - "--redis-host"
        - $REDIS_HOST
        - "--redis-port"
        - $REDIS_PORT
    source:
      url: https://github.com/smithery-ai/redis-mcp/tree/smithery/config-wxbv
---


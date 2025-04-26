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
        REDIS_CA_PATH: "{{redis.ca_path}}"
        REDIS_SSL_KEYFILE: "{{redis.ssl_keyfile}}"
        REDIS_SSL_CERTFILE: "{{redis.ssl_certfile}}"
        REDIS_CERT_REQS: "{{redis.cert_reqs}}"
        REDIS_CA_CERTS: "{{redis.ca_certs}}"
        REDIS_CLUSTER_MODE: "{{redis.cluster_mode}}"
    source:
      url: https://github.com/redis/mcp-redis/tree/main
---

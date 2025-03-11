---
mcp:
  container:
    image: mcp/postgres:latest
    workdir: /app
    secrets:
      postgres.url: POSTGRES_URL
    command:
      $POSTGRES_URL
---

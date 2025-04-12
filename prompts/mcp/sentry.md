---
mcp:
  - container:
      image: mcp/sentry:latest
      workdir: /app
      secrets:
        sentry.auth_token: SENTRY_AUTH_TOKEN
      command:
        - --auth-token:
        - $SENTRY_AUTH_TOKEN:
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

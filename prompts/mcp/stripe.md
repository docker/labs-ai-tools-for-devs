---
mcp:
  - container:
      image: mcp/stripe:latest
      secrets:
        stripe.secret_key: STRIPE_SECRET_KEY
      command:
        - --tools=all:
  - source:
      url: https://github.com/stripe/agent-toolkit/tree/main
---

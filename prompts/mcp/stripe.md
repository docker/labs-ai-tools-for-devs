---
mcp:
  - container:
      image: mcp/stripe:latest
      workdir: /app
      secrets:
        stripe.api_key: API_KEY
      command:
        - "--tools=all"
        - "--api-key=$API_KEY"
    source:
      url: https://github.com/slimslenderslacks/agent-toolkit/tree/slim/docker
---


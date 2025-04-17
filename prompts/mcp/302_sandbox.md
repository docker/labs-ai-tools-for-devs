---
mcp:
  - container:
      image: mcp/302_sandbox:latest
      workdir: /app
      secrets:
        302_sandbox.api_key: 302AI_API_KEY
    source:
      url: https://github.com/302ai/302_sandbox_mcp/tree/main
---

---
mcp:
  - container:
      image: mcp/smithery-cli:latest
      workdir: /app
      secrets:
        smithery-cli.api_key: SMITHERY_API_KEY
    source:
      url: https://github.com/smithery-ai/smithery-cli-mcp/tree/main
---

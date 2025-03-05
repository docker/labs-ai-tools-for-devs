---
mcp:
  - container:
      image: mcp/brave-search:latest
      workdir: /app
      secrets:
        brave.api_key: BRAVE_API_KEY
---


---
mcp:
  - container:
      image: mcp/veyrax:latest
      workdir: /app
      secrets:
        veyrax.api_key: VEYRAX_API_KEY
    source:
      url: https://github.com/VeyraX/veyrax-mcp/tree/main
---

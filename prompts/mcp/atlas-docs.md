---
mcp:
  - container:
      image: mcp/atlas-docs:latest
      workdir: /app
      environment:
        ATLAS_API_URL: "{{atlas-docs.api_url|safe}}"
    source:
      url: https://github.com/CartographAI/atlas-docs-mcp/tree/master
---

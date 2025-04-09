---
mcp:
  - container:
      image: mcp/atlas-docs
      environment:
        ATLAS_API_URL: "{{atlas.api_url|safe}}"
  - source:
      url: https://github.com/CartographAI/atlas-docs-mcp
---

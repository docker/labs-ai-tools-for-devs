---
mcp:
  - container:
      image: mcp/openapi-schema:latest
      workdir: /app
      volumes:
        - "{{openApiSchemaPath|or:[]|volume|into}}"
    source:
      url: https://github.com/slimslenderslacks/mcp-openapi-schema/tree/master
---

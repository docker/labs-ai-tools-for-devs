---
mcp:
  - container:
      image: vonwig/openapi-schema:latest
      workdir: /app
      volumes:
        - "{{openApiSchemaPath|or:[]|volume|into}}"
---


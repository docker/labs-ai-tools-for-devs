---
mcp:
  - container:
      image: mcp/filesystem:latest
      workdir: /app
      volumes:
        - "{{filesystem.paths|volume|into}}"
      command:
        - "{{filesystem.paths|into}}"
parameters-values:
  filesystem.allowed_paths:
    - /Users/slim
---


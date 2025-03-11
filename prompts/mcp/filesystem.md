---
mcp:
  - container:
      image: mcp/filesystem:latest
      workdir: /app
      volumes:
        - "{{filesystem.paths|volume|into}}"
      command:
        - "{{filesystem.paths|into}}"
parameter-values:
  filesystem:
    paths:
      - /Users/local-test
---


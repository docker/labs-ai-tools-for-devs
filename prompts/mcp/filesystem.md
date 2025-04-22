---
mcp:
  - container:
      image: mcp/filesystem:latest
      workdir: /app
      volumes:
        - "{{filesystem.paths|volume|into}}"
      command:
        - "{{filesystem.paths|into}}"
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
parameter-values:
  filesystem:
    paths:
      - /Users/local-test
---

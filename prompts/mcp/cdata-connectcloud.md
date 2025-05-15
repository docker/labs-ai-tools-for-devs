---
mcp:
  - container:
      image: mcp/cdata-connectcloud:latest
      workdir: /app
      secrets:
        cdata.pat: CDATA_PAT
      environment:
        CDATA_USERNAME: "{{cdata-connectcloud.username}}"
    source:
      url: https://github.com/CDataSoftware/connectcloud-mcp-server/tree/main
---

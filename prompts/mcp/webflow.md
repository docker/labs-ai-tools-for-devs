---
mcp:
  - container:
      image: mcp/webflow:latest
      secrets:
        webflow.token: WEBFLOW_TOKEN
    source:
      url: https://github.com/slimslenderslacks/mcp-server/tree/slim/docker
---

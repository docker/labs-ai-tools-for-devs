---
mcp:
  - container:
      image: mcp/octomind:latest
      secrets:
        octomind.api_key: APIKEY
  - source:
      url: https://github.com/OctoMind-dev/octomind-mcp
---

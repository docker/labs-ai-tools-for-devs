---
mcp:
  - container:
      image: mcp/elevenlabs:latest
      workdir: /app
      secrets:
        elevenlabs.api_key: ELEVENLABS_API_KEY
    source:
      url: https://github.com/elevenlabs/elevenlabs-mcp/tree/refs/pull/17/merge
---

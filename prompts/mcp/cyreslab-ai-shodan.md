---
mcp:
  - container:
      image: mcp/cyreslab-ai-shodan:latest
      workdir: /app
      secrets:
        cyreslab-ai-shodan.api_key: SHODAN_API_KEY
    source:
      url: https://github.com/Cyreslab-AI/shodan-mcp-server/tree/main
---

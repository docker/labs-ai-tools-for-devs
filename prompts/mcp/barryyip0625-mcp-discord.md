---
mcp:
  - container:
      image: mcp/mcp-discord:latest
      workdir: /app
      secrets:
        discord.token: DISCORD_TOKEN
    source:
      url: https://github.com/slimslenderslacks/mcp-discord/tree/slim/docker
---


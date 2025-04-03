---
mcp:
  - container:
      image: mcp/discord:latest
      workdir: /app
      secrets:
        discord.token: DISCORD_TOKEN
    source:
      url: https://github.com/barryyip0625/mcp-discord
---


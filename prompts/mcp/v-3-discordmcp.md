---
mcp:
  - container:
      image: mcp/discordmcp:latest
      workdir: /app
      secrets:
        discord.token: DISCORD_TOKEN
    source:
      url: https://github.com/slimslenderslacks/discordmcp/tree/slim/docker
---


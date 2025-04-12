---
mcp:
  - container:
      image: mcp/discord:latest
      secrets:
        discord.token: DISCORD_TOKEN
  - source:
      url: https://github.com/slimslenderslacks/mcp-discord/tree/slim/docker
---

---
mcp:
  - container:
      image: mcp/slack:latest
      workdir: /app
      secrets:
        slack.bot_token: SLACK_BOT_TOKEN
        slack.team_id: SLACK_TEAM_ID
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---

---
mcp:
  - container:
      image: mcp/slack:latest
      workdir: /app
      secrets:
        slack.bot_token: SLACK_BOT_TOKEN
      environment:
        SLACK_TEAM_ID: "{{slack.team_id}}"
        SLACK_CHANNEL_IDS: "{{slack.channel_ids}}"
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.24
---

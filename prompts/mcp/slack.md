---
mcp:
  - container:
      image: mcp/slack:latest
      environment:
        SLACK_BOT_TOKEN: "{{ slack.bot_token }}"
        SLACK_TEAM_ID: "{{ slack.team_id }} "
---


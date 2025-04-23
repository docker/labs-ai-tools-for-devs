---
mcp:
  - container:
      image: mcp/line:latest
      workdir: /app
      secrets:
        line.access_token: CHANNEL_ACCESS_TOKEN
      environment:
        DESTINATION_USER_ID: "{{line.user_id}}"
    source:
      url: https://github.com/line/line-bot-mcp-server/tree/main
---

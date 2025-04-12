---
mcp:
  - container:
      image: mcp/resend:latest
      workdir: /app
      secrets:
        resend.api_key: RESEND_API_KEY
      environment:
        REPLY_TO_EMAIL_ADDRESSES: "{{resend.reply_to}}"
        SENDER_EMAIL_ADDRESS: "{{resend.sender}}"
  - source:
      url: https://github.com/slimslenderslacks/mcp-send-email/tree/slim/docker
---

---
mcp:
  - container:
      image: mcp/audiense-insights
      secrets:
        audiense.client_secret: AUDIENSE_CLIENT_SECRET
        audiense.twitter_bearer_token: TWITTER_BEARER_TOKEN
      environment:
        AUDIENSE_CLIENT_ID: "{{audiense.client_id}}"
  - source:
      url: https://github.com/AudienseCo/mcp-audiense-insights
---

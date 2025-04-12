---
mcp:
  - container:
      image: mcp/audiense-insights:latest
      secrets:
        audiense-insights.client_secret: AUDIENSE_CLIENT_SECRET
        audiense-insights.twitter_bearer_token: TWITTER_BEARER_TOKEN
      environment:
        AUDIENSE_CLIENT_ID: "{{audiense-insights.client_id}}"
  - source:
      url: https://github.com/AudienseCo/mcp-audiense-insights/tree/main
---

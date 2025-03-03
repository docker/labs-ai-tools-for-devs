---
mcp:
  - container:
      image: vonwig/stripe:latest
      workdir: /app
      secrets:
        stripe.api_key: API_KEY
      command:
        - "--tools=all"
        - "--api-key=$API_KEY"
---


---
mcp:
  - container:
      image: mcp/stripe:latest
      command:
        - "--tools=all"
        - "--api-key={{stripe.api_key}}"
---


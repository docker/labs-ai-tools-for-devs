---
mcp:
  - container:
      image: mcp/armor-crypto:latest
      workdir: /app
      secrets:
        armor-crypto.api_key: ARMOR_API_KEY
      environment:
        ARMOR_API_URL: "{{armor-crypto.api_url|safe}}"
  - source:
      url: https://github.com/armorwallet/armor-crypto-mcp/tree/main
---

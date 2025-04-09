---
mcp:
  - container:
      image: mcp/armor-crypto
      workdir: /app
      secrets:
        armor.api_key: ARMOR_API_KEY
      environment:
        ARMOR_API_URL: "{{armor.api_url|safe}}"
  - source:
      url: https://github.com/armorwallet/armor-crypto-mcp
---

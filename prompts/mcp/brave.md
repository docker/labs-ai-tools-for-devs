---
mcp:
  - name: brave
    container:
      image: mcp/brave-search:latest
      environment:
        BRAVE_API_KEY: "{{ brave.api_key }}"
---


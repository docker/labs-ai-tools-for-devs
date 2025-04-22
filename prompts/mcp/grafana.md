---
mcp:
  - container:
      image: mcp/grafana:latest
      workdir: /app
      secrets:
        grafana.api_key: GRAFANA_API_KEY
      environment:
        GRAFANA_URL: "{{grafana.url|safe}}"
      command:
        - "--transport=stdio"
    source:
      url: https://github.com/grafana/mcp-grafana/tree/main
---

---
mcp:
  - container:
      image: mcp/elasticsearch:latest
      workdir: /app
      secrets:
        elasticsearch.api_key: ES_API_KEY
      environment:
        ES_URL: "{{elasticsearch.url|safe}}"
    source:
      url: https://github.com/elastic/mcp-server-elasticsearch/tree/refs/pull/37/merge
---

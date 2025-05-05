---
mcp:
  - container:
      image: mcp/neo4j-cloud-aura-api:latest
      workdir: /app
      secrets:
        neo4j.password: NEO4J_AURA_CLIENT_SECRET
      environment:
        NEO4J_AURA_CLIENT_ID: "{{neo4j.client_id}}"
    source:
      url: https://github.com/neo4j-contrib/mcp-neo4j/tree/main/servers/mcp-neo4j-cloud-aura-api
---

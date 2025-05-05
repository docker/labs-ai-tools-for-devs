---
mcp:
  - container:
      image: mcp/neo4j-memory:latest
      workdir: /app
      secrets:
        neo4j.password: NEO4J_PASSWORD
      environment:
        NEO4J_URL: "{{neo4j.url}}"
        NEO4J_USERNAME: "{{neo4j.username}}"
    source:
      url: https://github.com/slimslenderslacks/mcp-neo4j/tree/main/servers/mcp-neo4j-memory
---

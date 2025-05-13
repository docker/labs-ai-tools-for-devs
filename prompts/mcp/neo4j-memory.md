---
mcp:
  - container:
      image: mcp/neo4j-memory:latest
      workdir: /app
      secrets:
        neo4j.password: NEO4J_PASSWORD
      environment:
        NEO4J_URL: "{{neo4j-memory.url}}"
        NEO4J_USERNAME: "{{neo4j-memory.username}}"
    source:
      url: https://github.com/neo4j-contrib/mcp-neo4j/tree/main/servers/mcp-neo4j-memory
---

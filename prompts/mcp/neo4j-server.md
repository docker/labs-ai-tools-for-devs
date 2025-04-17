
---
mcp:
  - container:
      image: mcp/neo4j-server:latest
      workdir: /app
      secrets:
        neo4j.password: NEO4J_PASSWORD
        neo4j.username: NEO4J_USERNAME
      entrypoint:
        - "/app/mcp-neo4j-memory"
      command:
        - --db-url
        - "{{neo4j.url}}"
        - --username
        - "${NEO4J_USERNAME}"
        - --password
        - "${NEO4J_PASSWORD}"
    source:
      url: https://github.com/slimslenderslacks/mcp-neo4j
---

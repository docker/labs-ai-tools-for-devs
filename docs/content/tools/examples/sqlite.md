---
title: sqlite
---

# Description

Use sqlite containers to provide 3 tools:

* `read-query`
* `list-tables`
* `describe-table`

The sqlite database ( /mcp/test1.db ) is mounted using a Docker volume.

Use these tools to ask Claude to explore the data using the tools above.

Here's a fully worked 
[example](https://github.com/docker/labs-ai-tools-for-devs/blob/main/prompts/examples/mcp-sqlite.md?plain=1) 
for building insights from a user defined topic.

# Prompt Code

```markdown
---
tools:
  - name: read-query
    description: Execute a SELECT query on the SQLite database
    parameters:
      type: object
      properties:
        query:
          type: string
          description: SELECT SQL query to execute
    container: &sqlite-container
      image: &sqlite-image vonwig/sqlite:latest
      command:
        - &db "/mcp/test1.db"
        - "{{query|safe}}"
      volumes: &mounts
        - "mcp-test:/mcp"
  - name: list-tables
    description: List all tables in the SQLite database
    container:
      image: *sqlite-image
      command:
        - *db
        - "SELECT name from sqlite_master WHERE type='table'"
      volumes: *mounts
  - name: describe-table
    description: Get the schema information for a specific table
    parameters:
      type: object
      properties:
        table_name:
          type: string
          description: Name of the table to describe
    container:
      image: *sqlite-image
      command:
        - *db
        - "PRAGMA table_info({{table_name}})"
      volumes: *mounts
---

```

